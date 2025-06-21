import React, {useState} from 'react';
import {Button, SelectMenu, TextInput} from "evergreen-ui";

const Workers = () => {

    const [selected, setSelected] = useState('')


    return (
        <div
            className="h-[100vh] w-[100vw] flex justify-center items-center bg-secondary-900 bg-opacity-75 absolute top-0 left-0 z-1">
            <form
                className="space-y-6 p-4 border rounded-md bg-white border-white relative w-full mx-1 sm:max-w-sm md:max-w-md lg:max-w-lg">

                <button>
                    <img className="h-6 absolute top-5 right-5" src="/xmark.svg" alt="close"/>
                </button>

                <h1 className="font-medium text-center text-xl" style={{marginTop: "-5px"}}>Дополнительная информация
                </h1>

                <div>
                    <TextInput
                        placeholder="Введите email сотрудника"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <SelectMenu
                        title="Выберите роль"
                        options={['Apple', 'Apricot', 'Banana', 'Cherry', 'Cucumber'].map((label) => ({
                            label,
                            value: label
                        }))}
                        selected={selected}
                        onSelect={(item) => setSelected(item.value)}
                    >
                        <Button maxWidth={462}
                                className="text-sm font-medium w-full">{selected || 'Выберите роль'}</Button>
                    </SelectMenu>
                </div>


                <div>
                    <SelectMenu
                        title="Выберите отдел"
                        options={['Apple', 'Apricot', 'Banana', 'Cherry', 'Cucumber'].map((label) => ({
                            label,
                            value: label
                        }))}
                        selected={selected}
                        onSelect={(item) => setSelected(item.value)}
                    >
                        <Button maxWidth={462}
                                className="text-sm font-medium w-full">{selected || 'Выберите отдел'}</Button>
                    </SelectMenu>
                </div>


                <div className="flex justify-between items-center flex-wrap gap-2 md:flex-nowrap w-full">
                    <button
                        type="button"
                        className="text-sm font-medium px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:w-[47%]"
                    >
                        Очистить
                    </button>

                    <button
                        type="submit"
                        className="text-sm font-medium px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 sm:w-[47%]"
                    >
                        Создать
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Workers;