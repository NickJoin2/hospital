import {Link} from "react-router-dom";

const NoData = ({ title = "Ничего не найдено", message = "", icon: Icon }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {Icon && <Icon className="w-16 h-16 text-gray-400" />}
            <h2 className="mt-4 text-xl font-semibold text-gray-700">{title}</h2>
            {message && <p className="text-gray-500 mt-2 text-center">{message}</p>}
            <Link
                to="/patients"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Вернуться к списку
            </Link>
        </div>
    );
};

export default NoData;