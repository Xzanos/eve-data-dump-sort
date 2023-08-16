import React, { useEffect, useState } from "react";
import yaml from "js-yaml";
import { Category, Group, Type } from "./YamlLoader";

const YamlLoader: React.FC = () => {
  const [data, setData] = useState<{ category: Record<string, Category>; group: Record<string, Group>; type: Record<string, Type> } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const categoryResponse = await fetch("categoryIDs.yaml");
      const categoryData = await categoryResponse.text();
      const category = yaml.load(categoryData);

      const groupResponse = await fetch("groupIDs.yaml");
      const groupData = await groupResponse.text();
      const group = yaml.load(groupData);

      const typeResponse = await fetch("typeIDs.yaml");
      const typeData = await typeResponse.text();
      const type = yaml.load(typeData);

      setData({ category, group, type });
    };
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const sortedCategories = Object.entries(data.category)
    .map(([id, category]) => ({
      id,
      name: category.name.en,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedGroups = Object.entries(data.group)
    .map(([id, group]) => ({
      id,
      name: group.name.en,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedTypes = Object.entries(data.type)
    .map(([id, type]) => ({
      id,
      name: type.name.en,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredTypes = selectedCategory
    ? sortedTypes.filter((type) => data.group[data.type[type.id].groupID].categoryID === parseInt(selectedCategory))
    : sortedTypes;

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h2>Categories:</h2>
        <ul>
          {sortedCategories.map((category) => (
            <li key={category.id} onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Groups:</h2>
        <ul>
          {sortedGroups.map((group) => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Types:</h2>
        <ul>
          {filteredTypes.map((type) => (
            <li key={type.id}>{type.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YamlLoader;
