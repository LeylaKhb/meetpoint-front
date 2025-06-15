import React, {useEffect, useState} from 'react';
import {Helmet, HelmetProvider} from 'react-helmet-async';
import Select from 'react-select';
import "../styles/test.css";
import {Tag} from "../models/Tag";
import {fetchWithAuthRetry} from "../components/auth";

interface OptionType {
    value: string;
    label: string;
}

interface TagCategories {
    [key: string]: OptionType[];
}

const apiUrl = process.env.REACT_APP_API_URL;
const mockTagOptions: TagCategories = {
    sport: [
        {value: '1', label: 'Футбол'},
        {value: '2', label: 'Баскетбол'},
        {value: '3', label: 'Теннис'},
        {value: '4', label: 'Плавание'},
        {value: '5', label: 'Бег'},
    ],
    food: [
        {value: '6', label: 'Итальянская'},
        {value: '7', label: 'Японская'},
        {value: '8', label: 'Мексиканская'},
        {value: '9', label: 'Вегетарианская'},
        {value: '10', label: 'Фастфуд'},
    ],
    music: [
        {value: '11', label: 'Рок'},
        {value: '12', label: 'Поп'},
        {value: '13', label: 'Хип-хоп'},
        {value: '14', label: 'Электронная'},
        {value: '15', label: 'Джаз'},
    ],
    culture: [
        {value: '16', label: 'Театр'},
        {value: '17', label: 'Музеи'},
        {value: '18', label: 'Выставки'},
        {value: '19', label: 'Концерты'},
        {value: '20', label: 'Фестивали'},
    ],
    movie: [
        {value: '21', label: 'Боевики'},
        {value: '22', label: 'Комедии'},
        {value: '23', label: 'Драмы'},
        {value: '24', label: 'Фантастика'},
        {value: '25', label: 'Триллеры'},
    ],
    profession: [
        {value: '26', label: 'IT'},
        {value: '27', label: 'Медицина'},
        {value: '28', label: 'Образование'},
        {value: '29', label: 'Маркетинг'},
        {value: '30', label: 'Финансы'},
    ]
};

const mockMyTags = {
    sport: [{value: '3', label: 'Теннис'}],
    food: [{value: '8', label: 'Мексиканская'}, {value: '10', label: 'Фастфуд'}],
    music: [{value: '14', label: 'Электронная'}],
    culture: [
        {value: '19', label: 'Концерты'},
    ],
    movie: [
        {value: '21', label: 'Боевики'},
        {value: '22', label: 'Комедии'},
    ],
    profession: [
        {value: '26', label: 'IT'},
    ]
}
const Test: React.FC = () => {
    const [tagOptions, setTagOptions] = useState<TagCategories>({});

    const [selected, setSelected] = useState<TagCategories>({
        sport: [],
        food: [],
        music: [],
        culture: [],
        movie: [],
        profession: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tagsResponse = await fetch(`${apiUrl}/tags`);
                if (!tagsResponse.ok) {
                    throw new Error('Не удалось загрузить теги');
                }

                const responseData: { tags: Tag[] } = await tagsResponse.json();
                const tagsData = responseData.tags.filter(tag => tag.type.toLowerCase() !== "default");;

                const groupedTags = tagsData.reduce((acc, tag) => {
                    const category = tag.type.toLowerCase();
                    const option = {
                        value: tag.id.toString(),
                        label: tag.name
                    };

                    if (!acc[category]) {
                        acc[category] = [];
                    }

                    acc[category].push(option);
                    return acc;
                }, {} as TagCategories);

                setTagOptions(groupedTags);

                const accessToken = localStorage.getItem("access");
                if (accessToken) {
                    const testResponse = await fetchWithAuthRetry(`${apiUrl}/test`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (testResponse.ok) {
                        const testData = await testResponse.json();
                        console.log('Test data:', testData);
                    }
                }
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setTagOptions(mockTagOptions);
                if (localStorage.getItem("access")) {
                    setSelected(mockMyTags);
                }
            }
        };

        fetchData();
    }, []);

    const handleChange = (name: keyof typeof selected) => (newValue: any) => {
        setSelected(prev => ({...prev, [name]: newValue}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetchWithAuthRetry(`${apiUrl}/sheet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    interestsIds: Object.values(selected)
                        .flat()
                        .map(item => item.value)
                }),
            });

            if (!response.ok) {
                throw new Error('Не удалось сохранить предпочтения');
            }

            console.log('Предпочтения успешно сохранены');
        } catch (err) {
            console.error('Ошибка при сохранении предпочтений:', err);
        }
        window.location.assign("/personal_account")
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: '#2A2438',
            borderColor: '#4A4458',
            color: '#E2E0E5',
            minHeight: '44px',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--primary-color)'
            }
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#2A2438',
            border: '1px solid #4A4458'
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#4A4458' : '#2A2438',
            color: '#E2E0E5',
            '&:active': {
                backgroundColor: 'var(--primary-color)'
            }
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#4A4458'
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#E2E0E5'
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#E2E0E5',
            ':hover': {
                backgroundColor: 'var(--primary-color)',
                color: 'white'
            }
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#E2E0E5'
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#E2E0E5'
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#8A8495'
        })
    };

    return (
        <div className="test-container">
            <HelmetProvider>
                <Helmet title="Тест"/>
            </HelmetProvider>

            <div className="test-form-container">
                <h2 className="test-title">
                    Выберите свои предпочтения
                </h2>
                <p className="test-subtitle">
                    Отметьте то, что вам нравится. Можно выбрать несколько вариантов или пропустить, если ничего не
                    подходит.
                </p>

                <form onSubmit={handleSubmit}>
                    {Object.entries(tagOptions).map(([key, options]) => (
                        <div key={key} className="test-select-container">
                            <label className="test-label">
                                {getLabel(key)}
                            </label>
                            <Select
                                isMulti
                                options={options}
                                value={selected[key as keyof typeof selected]}
                                onChange={handleChange(key as keyof typeof selected)}
                                placeholder={`Выберите ${getLabel(key).toLowerCase()}...`}
                                styles={customStyles}
                                classNamePrefix="select"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="test-submit-button"
                    >
                        Сохранить предпочтения
                    </button>
                </form>
            </div>
        </div>
    );
};

function getLabel(key: string): string {
    const labels: Record<string, string> = {
        sport: 'Спортивные активности',
        food: 'Предпочтения в еде',
        music: 'Предпочтения в музыке',
        culture: 'Культурные предпочтения',
        movie: 'Жанры кино',
        profession: 'Профессия'
    };
    return labels[key] || key;
}
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [tagOptions, setTagOptions] = useState<TagCategories>({});
//
//     const [selected, setSelected] = useState<TagCategories>({
//         sport: [],
//         food: [],
//         music: [],
//         culture: [],
//         movie: [],
//         profession: []
//     });
//
//     useEffect(() => {
//         const fetchTags = async () => {
//             try {
//                 const response = await fetch(`${apiUrl}/tags`);
//                 if (!response.ok) {
//                     throw new Error('Не удалось загрузить теги');
//                 }
//                 const data: Tag[] = await response.json();
//
//                 const groupedTags = data.reduce<TagCategories>((acc, tag) => {
//                     const category = tag.category.toLowerCase();
//                     const option = {
//                         value: tag.id.toString(),
//                         label: tag.name
//                     };
//
//                     if (!acc[category]) {
//                         acc[category] = [];
//                     }
//
//                     acc[category].push(option);
//                     return acc;
//                 }, {});
//
//                 setTagOptions(groupedTags);
//                 setIsLoading(false);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
//                 setIsLoading(false);
//                 setTagOptions(mockTagOptions);
//             }
//         };
//
//         fetchTags();
//     }, []);
//
//     const handleChange = (name: keyof typeof selected) => (newValue: any) => {
//         setSelected(prev => ({ ...prev, [name]: newValue }));
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//
//         try {
//             const response = await fetch(`${apiUrl}/user/preferences`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     preferences: selected
//                 }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Не удалось сохранить предпочтения');
//             }
//
//             console.log('Предпочтения успешно сохранены');
//         } catch (err) {
//             console.error('Ошибка при сохранении предпочтений:', err);
//             setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
//         }
//     };
//
//     const customStyles = {
//         control: (provided: any) => ({
//             ...provided,
//             backgroundColor: '#2A2438',
//             borderColor: '#4A4458',
//             color: '#E2E0E5',
//             minHeight: '44px',
//             boxShadow: 'none',
//             '&:hover': {
//                 borderColor: 'var(--primary-color)'
//             }
//         }),
//         menu: (provided: any) => ({
//             ...provided,
//             backgroundColor: '#2A2438',
//             border: '1px solid #4A4458'
//         }),
//         option: (provided: any, state: any) => ({
//             ...provided,
//             backgroundColor: state.isFocused ? '#4A4458' : '#2A2438',
//             color: '#E2E0E5',
//             '&:active': {
//                 backgroundColor: 'var(--primary-color)'
//             }
//         }),
//         multiValue: (provided: any) => ({
//             ...provided,
//             backgroundColor: '#4A4458'
//         }),
//         multiValueLabel: (provided: any) => ({
//             ...provided,
//             color: '#E2E0E5'
//         }),
//         multiValueRemove: (provided: any) => ({
//             ...provided,
//             color: '#E2E0E5',
//             ':hover': {
//                 backgroundColor: 'var(--primary-color)',
//                 color: 'white'
//             }
//         }),
//         input: (provided: any) => ({
//             ...provided,
//             color: '#E2E0E5'
//         }),
//         singleValue: (provided: any) => ({
//             ...provided,
//             color: '#E2E0E5'
//         }),
//         placeholder: (provided: any) => ({
//             ...provided,
//             color: '#8A8495'
//         })
//     };
//
//     return (
//         <div className="test-container">
//             <HelmetProvider>
//                 <Helmet title="Тест" />
//             </HelmetProvider>
//
//             <div className="test-form-container">
//                 <h2 className="test-title">
//                     Выберите свои предпочтения
//                 </h2>
//                 <p className="test-subtitle">
//                     Отметьте то, что вам нравится. Можно выбрать несколько вариантов или пропустить, если ничего не подходит.
//                 </p>
//
//                 <form onSubmit={handleSubmit}>
//                     {Object.entries(tagOptions).map(([key, options]) => (
//                         <div key={key} className="test-select-container">
//                             <label className="test-label">
//                                 {getLabel(key)}
//                             </label>
//                             <Select
//                                 isMulti
//                                 options={options}
//                                 value={selected[key as keyof typeof selected]}
//                                 onChange={handleChange(key as keyof typeof selected)}
//                                 placeholder={`Выберите ${getLabel(key).toLowerCase()}...`}
//                                 styles={customStyles}
//                                 classNamePrefix="select"
//                             />
//                         </div>
//                     ))}
//
//                     <button
//                         type="submit"
//                         className="test-submit-button"
//                     >
//                         Сохранить предпочтения
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// function getLabel(key: string): string {
//     const labels: Record<string, string> = {
//         sport: 'Спортивные активности',
//         food: 'Предпочтения в еде',
//         music: 'Предпочтения в музыке',
//         culture: 'Культурные предпочтения',
//         movie: 'Жанры кино',
//         profession: 'Профессия'
//     };
//     return labels[key] || key;
// }
//
export default Test;