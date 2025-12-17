
import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
