import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const apiUrl = process.env.REACT_APP_API_URL;

type Tag = { id: number; name: string; type: string };
type TagOption = { value: string; label: string };
type TagGroup = { label: string; options: TagOption[] };

interface Props {
    onChange: (tagIds: string[]) => void;
}

const TagFilter: React.FC<Props> = ({ onChange }) => {
    const [tagOptions, setTagOptions] = useState<TagGroup[]>([]);
    const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch(`${apiUrl}/tags`);
            const data = await res.json();
            const tags: Tag[] = data.tags;

            const grouped: Record<string, TagOption[]> = {};
            tags.forEach(tag => {
                if (!grouped[tag.type]) grouped[tag.type] = [];
                grouped[tag.type].push({ value: String(tag.id), label: tag.name });
            });

            const groups: TagGroup[] = Object.entries(grouped).map(([type, options]) => ({
                label: type[0].toUpperCase() + type.slice(1),
                options
            }));

            setTagOptions(groups);
        };

        fetchTags();
    }, []);

    useEffect(() => {
        onChange(selectedTags.map(tag => tag.value));
    }, [selectedTags]);

    return (
        <div className="filters">
            <label className="filters-title">Фильтр по тегам:</label>
            <Select
                isMulti
                options={tagOptions}
                value={selectedTags}
                onChange={(options) => setSelectedTags(options as TagOption[])}
                placeholder="Выберите теги..."
                className="tag-select"
            />
        </div>
    );
};

export default TagFilter;
