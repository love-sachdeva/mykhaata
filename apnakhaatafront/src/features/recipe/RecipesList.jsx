import React from 'react';
import { useRecipes } from './hook';
import { useNavigate } from 'react-router-dom';

export default function RecipesList() {
    const navigate = useNavigate();
    const { data: recipes = [], isLoading } = useRecipes();
    if (isLoading) return <div className="p-4 text-center">Loading…</div>;

    return (
        <div className="flex flex-col min-h-screen bg-brandBg font-sans relative">
            {/* Header */}
            <div className="flex items-center p-4 pb-2">
                <button onClick={() => navigate('/')} className="text-textPrimary">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/>
                    </svg>
                </button>
                <h2 className="flex-1 text-center text-lg font-bold text-textPrimary">
                    Recipes
                </h2>
                <div className="w-6" />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4">
                {recipes.map(r => (
                    <div
                        key={r.id}
                        className="flex items-center justify-between py-3 border-b border-cardBg"
                        // extra pr-12 makes room for the pencil
                    >
                        <div
                            onClick={() => navigate(`/recipes/${r.id}`)}
                            className="cursor-pointer pr-12"
                        >
                            <p className="text-textPrimary text-base font-medium">
                                {r.productName}
                            </p>
                            <p className="text-textSecondary text-sm">
                                {r.components
                                    .map(c => `${c.rawMaterialName}: ${c.quantityPerUnit}g`)
                                    .join(', ')}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/recipes/${r.id}`)}
                            className="text-textPrimary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor"
                                 viewBox="0 0 256 256">
                                <path
                                    d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Floating Add Button */}
            <button
                onClick={() => navigate('/recipes/new')}
                className="
          fixed bottom-6 right-6
          h-14 w-14
          bg-btnPrimary text-textPrimary
          rounded-full shadow-lg
          flex items-center justify-center
        "
            >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>
                </svg>
            </button>
        </div>
    );
}
