import React from 'react';
import {TextInput} from "evergreen-ui";

const Patients = () => {
    return (
        <div
            className="h-[100vh] w-[100vw] flex justify-center items-center bg-secondary-900 bg-opacity-75 absolute top-0 left-0 z-1">
            <form
                className="space-y-6 p-4 border rounded-md bg-white border-white relative w-full mx-1 sm:max-w-sm md:max-w-md lg:max-w-lg">

                <button>
                    <img className="h-6 absolute top-5 right-5" src="/xmark.svg" alt="close"/>
                </button>

                <h1 className="font-medium text-center text-xl" style={{marginTop: "-5px"}}>Информация о пациенте
                </h1>

                <div>
                    <TextInput
                        placeholder="Введите имя"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <TextInput
                        placeholder="Введите фамилию"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <TextInput
                        placeholder="Введите отчество"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <TextInput
                        placeholder="Введите дату рождения"
                        type="date"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <TextInput
                        placeholder="Введите номер телефона"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <TextInput
                        placeholder="Введите номер паспорта"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
                </div>

                <div>
                    <TextInput
                        placeholder="Введите серию пасспорта"
                        type="text"
                        required
                        maxWidth={462}
                        className="text-sm font-medium w-full placeholder-gray-400"
                    />
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

export default Patients;