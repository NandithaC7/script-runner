import React, { useState } from 'react'
import './Header.css'

import { Search } from 'lucide-react'
import keycloak from '../keycloak'

export default function Header({
    searchTerm,
    setSearchTerm,
    pages,
    tools,
    setActivePage
}) {

    const [showDropdown, setShowDropdown] = useState(false)

    const lowerSearch = searchTerm.toLowerCase()

    const filteredPages = pages.filter((page) =>
        page.label.toLowerCase().includes(lowerSearch)
    )

    const filteredTools = tools.filter((tool) =>
        tool.name?.toLowerCase().includes(lowerSearch)
    )

    return (

        <header className="header">

            <div className="header-left">

                <h1 className="header-title">
                    RPA
                </h1>

            </div>

            <div className="header-right">

                <div className="search-wrapper">

                    <div className="header-search">

                        <input
                            type="text"
                            placeholder="Search projects or tools"
                            value={searchTerm}
                            onChange={(e) => {

                                setSearchTerm(e.target.value)

                                setShowDropdown(true)
                            }}
                            onFocus={() => setShowDropdown(true)}
                        />

                        <button className="search-btn">
                            <Search size={20} />
                        </button>

                    </div>

                    {showDropdown &&
                        searchTerm.trim() !== '' && (

                            <div className="search-dropdown">

                                {filteredPages.length > 0 && (

                                    <>

                                        <div className="search-section-title">
                                            Projects
                                        </div>

                                        {filteredPages.map((page) => (

                                            <div
                                                key={page.id}
                                                className="search-item"
                                                onClick={() => {

                                                    setActivePage(page.id)

                                                    setSearchTerm('')

                                                    setShowDropdown(false)
                                                }}
                                            >
                                                {page.label}
                                            </div>

                                        ))}

                                    </>

                                )}

                                {filteredTools.length > 0 && (

                                    <>

                                        <div className="search-section-title">
                                            Tools
                                        </div>

                                        {filteredTools.map((tool) => (

                                            <div
                                                key={tool.id}
                                                className="search-item tool-result"
                                                onClick={() => {

                                                    setActivePage(tool.project)

                                                    setSearchTerm(tool.name)

                                                    setShowDropdown(false)
                                                }}
                                            >
                                                {tool.name}
                                            </div>

                                        ))}

                                    </>

                                )}

                                {filteredPages.length === 0 &&
                                    filteredTools.length === 0 && (

                                        <div className="search-no-results">
                                            No results found
                                        </div>

                                    )}

                            </div>

                        )}

                </div>

                <button
                    className="logout-btn"
                    onClick={() =>
                        keycloak.logout({
                            redirectUri: 'http://localhost:5173'
                        })
                    }
                >
                    Logout
                </button>

            </div>

        </header>

    )
}