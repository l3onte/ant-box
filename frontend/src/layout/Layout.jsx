import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBar from "../components/layout-components/SideBar";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-gray-200">
            <SideBar />

            <div>
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}