import React, { useState, Children, isValidElement, cloneElement } from "react";

// === Tab component ===
export const Tab = ({ children }) => {
    return <>{children}</>;
};

// === Tabs container ===
export const Tabs = ({ children, scrollable = false, defaultActiveKey, onTabChange }) => {
    const childArray = Children.toArray(children);
    const [activeKey, setActiveKey] = useState(defaultActiveKey || childArray[0]?.props.tabKey);

    const handleTabClick = (key) => {
        setActiveKey(key);
        onTabChange?.(key);
    };

    return (
        <div className="w-full">
            {/* Tab headers */}
            <div
                className={`flex border-b border-gray-200 ${
                    scrollable ? "overflow-y-auto" : "justify-start"
                }`}
            >
                <div className={`flex ${scrollable ? "space-x-0" : "space-x-1"}`}>
                    {childArray.map((child) => {
                        if (!isValidElement(child)) return null;
                        const key = child.props.tabKey;
                        const isActive = key === activeKey;

                        return (
                            <button
                                key={key}
                                onClick={() => handleTabClick(key)}
                                className={`
                                    relative px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out
                                    whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                    ${isActive
                                    ? "text-blue-600"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }
                                    ${scrollable ? "flex-shrink-0" : ""}
                                `}
                            >
                                {child.props.label}

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab content */}
            <div className="mt-4">
                {childArray.map((child) => {
                    if (!isValidElement(child)) return null;
                    return (
                        <div
                            key={child.props.tabKey}
                            className={`transition-opacity duration-200 ${
                                child.props.tabKey === activeKey
                                    ? "opacity-100 block"
                                    : "opacity-0 hidden"
                            }`}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};