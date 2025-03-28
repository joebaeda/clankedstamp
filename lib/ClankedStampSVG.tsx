import * as React from "react";

interface StampColors {
    northColor: string;
    northeastColor: string;
    eastColor: string;
    southeastColor: string;
    southColor: string;
    southwestColor: string;
    westColor: string;
    northwestColor: string;
}

const ClankedStampSVG = ({
    northColor,
    northeastColor,
    eastColor,
    southeastColor,
    southColor,
    southwestColor,
    westColor,
    northwestColor,
}: StampColors) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1022 638"
        fill="none"
        width="100%"
        height="100%"
    >
        <path
            d="M373 119h128v29H373zm51 58h77v29h-77zm57 58h20v28h-20z"
            fill={northColor}
        />
        <path
            d="M375 177v131h24V177zm50 50v81h25v-81zm51 51v30h25v-30z"
            fill={northeastColor}
        />
        <path
            d="M375 328v133h25V328zm50 0v83h25v-83zm51 0v31h24v-31z"
            fill={eastColor}
        />
        <path
            d="M374 491v29h126v-29zm50-58v29h76v-29zm56-58v28h19v-28z"
            fill={southeastColor}
        />
        <path
            d="M521 491v29h127v-29zm0-56v28h79v-28zm0-59v27h19v-27z"
            fill={southColor}
        />
        <path
            d="M521 330v29h25v-29zm51 0v81h25v-81zm50 0v133h26V330z"
            fill={southwestColor}
        />
        <path
            d="M521 277v31h25v-31zm51-50v81h25v-81zm50-50v131h25V177z"
            fill={westColor}
        />
        <path
            d="M522 235v27h18v-27zm0-58v29h76v-29zm0-58v28h126v-28z"
            fill={northwestColor}
        />
    </svg>
);
export default ClankedStampSVG;
