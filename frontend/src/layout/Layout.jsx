import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideBar from "../components/layout-components/SideBar";
import Header from "../components/layout-components/Header";

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-gray-200">
            <SideBar />

            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}