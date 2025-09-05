"use client";

import { useState } from "react";
import Image from "next/image";

// Ship type
type Ship = {
    name: string;
    image: string;
    fleetPower: number;
    description: string;
};

// Demo data — full 29 ships
const ships: Ship[] = [
    { name: "Arachnid", image: "/all_spacecrafts/Arachnid.png", fleetPower: 120, description: "Fast, insect-like scout ship." },
    { name: "ArcBlaster", image: "/all_spacecrafts/ArcBlaster.png", fleetPower: 150, description: "Equipped with powerful arc cannons." },
    { name: "Areisu", image: "/all_spacecrafts/Areisu.png", fleetPower: 140, description: "Lightweight, optimized for speed and agility." },
    { name: "Bison", image: "/all_spacecrafts/Bison.png", fleetPower: 180, description: "Heavy freighter with reinforced armor." },
    { name: "Cargo", image: "/all_spacecrafts/Cargo.png", fleetPower: 100, description: "Utility ship specialized for hauling resources." },
    { name: "Crossbow", image: "/all_spacecrafts/Crossbow.png", fleetPower: 160, description: "Long-range projectile support ship." },
    { name: "Cruxio", image: "/all_spacecrafts/Cruxio.png", fleetPower: 125, description: "Reliable balanced spacecraft." },
    { name: "Destructor", image: "/all_spacecrafts/Destructor.png", fleetPower: 200, description: "Aggressive battleship with destructive firepower." },
    { name: "Diablo", image: "/all_spacecrafts/Diablo.png", fleetPower: 210, description: "Feared in space battles, unleashes chaos." },
    { name: "Diverger", image: "/all_spacecrafts/Diverger.png", fleetPower: 130, description: "Multi-role spacecraft for tactical operations." },
    { name: "DodgeCharger", image: "/all_spacecrafts/DodgeCharger.png", fleetPower: 175, description: "Fast strike ship, classic Earth-inspired name." },
    { name: "Endra", image: "/all_spacecrafts/Endra.png", fleetPower: 155, description: "Durable mid-class ship with stable firepower." },
    { name: "Firebird", image: "/all_spacecrafts/Firebird.png", fleetPower: 170, description: "Flame-themed starship known for speed." },
    { name: "Harbinger", image: "/all_spacecrafts/Harbinger.png", fleetPower: 200, description: "Symbol of doom, feared warship." },
    { name: "Hull", image: "/all_spacecrafts/Hull.png", fleetPower: 110, description: "Basic model spacecraft, sturdy and simple." },
    { name: "Mjolnir Mark-V", image: "/all_spacecrafts/Mjolnir Mark-V.png", fleetPower: 250, description: "Legendary powerhouse named after Thor’s hammer." },
    { name: "NorthStar", image: "/all_spacecrafts/NorthStar.png", fleetPower: 160, description: "Guiding ship, dependable in deep space." },
    { name: "NTesla", image: "/all_spacecrafts/NTesla.png", fleetPower: 185, description: "Electric-powered futuristic spacecraft." },
    { name: "PointBreak", image: "/all_spacecrafts/PointBreak.png", fleetPower: 140, description: "Named after the classic, a strike-focused ship." },
    { name: "Raven", image: "/all_spacecrafts/Raven.png", fleetPower: 160, description: "Stealth ship specialized for ambush." },
    { name: "SciFighter", image: "/all_spacecrafts/SciFighter.png", fleetPower: 175, description: "Sci-fi inspired versatile combat ship." },
    { name: "Scorpion", image: "/all_spacecrafts/Scorpion.png", fleetPower: 150, description: "Deadly ship with sting-like weapons." },
    { name: "Seraph", image: "/all_spacecrafts/Seraph.png", fleetPower: 180, description: "Celestial support ship providing fleet synergy." },
    { name: "Skyjet", image: "/all_spacecrafts/Skyjet.png", fleetPower: 145, description: "Sleek fighter with atmospheric capabilities." },
    { name: "Starblaster", image: "/all_spacecrafts/Starblaster.png", fleetPower: 210, description: "Massive starship with concentrated laser fire." },
    { name: "StarSparrow", image: "/all_spacecrafts/StarSparrow.png", fleetPower: 125, description: "Light scout ship with evasive maneuvers." },
    { name: "SwitchBlade", image: "/all_spacecrafts/SwitchBlade.png", fleetPower: 165, description: "Sharp, tactical spacecraft for fast engagements." },
    { name: "Trident", image: "/all_spacecrafts/Trident.png", fleetPower: 200, description: "High-tier battleship with massive firepower." },
    { name: "Vanguard", image: "/all_spacecrafts/Vanguard.png", fleetPower: 195, description: "Frontline ship leading fleets into battle." },
];


export default function MiningCore() {
    const [view, setView] = useState<"main" | "hangar" | "detail">("main");
    const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const shipsPerPage = 6;
    const totalPages = Math.ceil(ships.length / shipsPerPage);

    // Slice ships for current page
    const startIndex = (currentPage - 1) * shipsPerPage;
    const currentShips = ships.slice(startIndex, startIndex + shipsPerPage);

    // -------------------- DETAIL VIEW --------------------
    if (view === "detail" && selectedShip) {
        return (
            <div className="h-full w-full text-green-400 font-mono flex flex-col border border-green-400 border-dashed p-4 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl">{selectedShip.name.toUpperCase()}</h1>
                    <button
                        className="text-green-400 hover:text-green-200"
                        onClick={() => setView("hangar")}
                    >
                        [X]
                    </button>
                </div>

                {/* Image */}
                <div className="flex justify-center mb-4">
                    <div className="w-[400px] h-[250px] relative">
                        <Image
                            src={selectedShip.image}
                            alt={selectedShip.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-4 space-y-1 text-sm">
                    <p>FLEET POWER: {selectedShip.fleetPower}</p>
                    <p>LOREM IPSUM PROPELLANT POWER</p>
                    <p>LOREM IPSUM (NON-NFT)</p>
                </div>

                {/* Description */}
                <p className="text-xs mb-4">{selectedShip.description}</p>

                {/* Toggle */}
                <div className="flex gap-2 mb-4">
                    <button className="px-4 py-1 border border-green-400 bg-green-600 text-black">
                        ON
                    </button>
                    <button className="px-4 py-1 border border-green-400">OFF</button>
                </div>

                {/* System Notes */}
                <div className="text-xs">
                    [ SYSTEM NOTES ] <br /> * ONE STATION PER WALLET ADDRESS REQUIRED.
                </div>
            </div>
        );
    }

    // -------------------- HANGAR VIEW --------------------
    if (view === "hangar") {
        return (
            <div className="h-full w-full text-green-400 font-mono flex flex-col">
                <h1 className="text-2xl mb-4">SPACE HANGAR</h1>
                <p className="mb-4">
                    &gt; 1. UPDATE HANGAR +1 SLOT [0.1 ETH] &nbsp;&nbsp; [{ships.length}/24]
                </p>

                {/* Ship Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {currentShips.map((ship) => (
                        <div
                            key={ship.name}
                            className="border border-green-400 border-dashed p-2 flex flex-col items-center cursor-pointer hover:text-green-200"
                            onClick={() => {
                                setSelectedShip(ship);
                                setView("detail");
                            }}
                        >
                            <p className="mb-2 text-sm">{ship.name}</p>
                            <div className="w-[120px] h-[120px] relative mb-2">
                                <Image
                                    src={ship.image}
                                    alt={ship.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-xs">STATUS: ON</p>
                            <p className="text-xs">FLEET POWER: {ship.fleetPower}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex gap-2 text-sm justify-center mb-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="disabled:text-gray-600"
                    >
                        &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 ${currentPage === page
                                ? "bg-green-600 text-black"
                                : "hover:text-green-200"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="disabled:text-gray-600"
                    >
                        &gt;
                    </button>
                </div>

                {/* Back */}
                <div className="mt-4">
                    <p
                        className="cursor-pointer hover:text-green-200"
                        onClick={() => setView("main")}
                    >
                        &gt; RETURN TO MINING CORE
                    </p>
                </div>
            </div>
        );
    }

    // -------------------- MAIN MINING CORE --------------------
    return (
        <div className="h-full w-full text-green-400 font-mono flex flex-col">
            <h1 className="text-xl mb-4">MINING CORE</h1>
            <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                <div className="space-y-1">
                    <p>Initializing Station Check: [ONLINE]</p>
                    <p>Fleet Slots Detected: [05/09]</p>
                    <p>Total Fleet Power: [4820]</p>
                    <p>Target: [Level 4]</p>
                </div>
                <div className="space-y-1">
                    <p>Mining Module: [ONLINE]</p>
                    <p>Claimable: 124.5 $UFO</p>
                    <p>Hourly Emission: 56.7 $UFO</p>
                    <p>Mined Today: 987.6 $UFO</p>
                </div>
            </div>

            {/* Core image */}
            <div className="flex-1 flex items-center justify-center mb-6">
                <div className="w-[300px] h-[300px] relative">
                    <Image
                        src="/assets/station-core.gif"
                        alt="Station Core"
                        fill
                        className="object-contain mix-blend-screen drop-shadow-[0_0_25px_rgba(0,255,0,0.6)]"
                        unoptimized
                    />
                </div>
            </div>

            <div className="text-sm space-y-2">
                <p>&gt; 1. UPGRADE MODULE [250 UFO]</p>
                <p
                    className="cursor-pointer hover:text-green-200"
                    onClick={() => setView("hangar")}
                >
                    &gt; 2. SPACE HANGAR
                </p>
                <p>&gt; 3. SUPPLY DEPOT</p>
            </div>
        </div>
    );
}
