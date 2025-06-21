import React, { useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi";
import CreateRole from "../widgets/other/CreateRole.jsx";
import { useDeleteRoleMutation, useGetRolesQuery } from "../app/redux/other/rolesApi.js";
import NoEntries from "../widgets/Allert/NoEntries.jsx";
import useSortableData from "../features/useSortableData.js";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spiner from "../widgets/other/Spiner.jsx";

const Roles = () => {

    const { data: roles, isLoading, isError: isRolesError, error: rolesError } = useGetRolesQuery();
    const [deleteRole, { isLoading: isDeleting, isError: isDeleteError, error: deleteError, isSuccess }] = useDeleteRoleMutation();

    const [activeCreate, setActiveCreate] = useState(false);

    const { items: sortedRoles, requestSort, sortConfig } = useSortableData(roles?.data || [], { key: 'id', direction: 'ascending' });

    const handleButton = () => {
        setActiveCreate(!activeCreate);
    };

    const handleDelete = async (id) => {
        try {
            await deleteRole(id).unwrap();
            toast.error("Роль удалена")
        } catch (err) {
          console.log(err)
        }
    };

    if(isLoading) return <Spiner/>

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />


            {activeCreate && (
                <CreateRole handleButton={handleButton} />
            )}
            <div className="p-4 my-4 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-center mt-3 text-4xl">Роли</h1>
                <div className="flex justify-between items-center pt-3">
                    <button
                        className="w-[150px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleButton}
                    >
                        Создать
                    </button>
                </div>
                {roles?.data.length === 0 && !isLoading && !isRolesError && (
                    <NoEntries text="=Ролей нет" />
                )}
                {roles?.data.length > 0 && (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer text-start"
                                    onClick={() => requestSort('id')}
                                >
                                    #
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => requestSort('role_name')}
                                >
                                    Роль
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Действия
                                </th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                            {sortedRoles.map((role) => (
                                <tr
                                    key={role.id}
                                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${role.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {role.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-center">
                                        {role.role_name}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                className="text-gray-500 hover:text-red-600 transition-colors"
                                                aria-label="Role delete"
                                                onClick={() => handleDelete(role.id)}
                                                disabled={isDeleting}
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default Roles;