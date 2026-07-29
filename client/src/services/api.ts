const baseUrl = import.meta.env.VITE_BASE_URL;


export interface Day {
    id: number;
    name: string;
}

export interface Plan {
    id: number;
    name: string;
    plan_type: 'main' | 'warmup' | 'cooldown';
    Days: Day[];
}
export interface Schedules {
    id: number;
    name: string;
    description: string;
    is_public: boolean;
    user_id: number;
    createdAt: string;
    Plans: Plan[];
}


export const getData = async (URL): Promise<Schedules[]> => {
    const res = await fetch(`${baseUrl}/${URL}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    });
    const data = await res.json();
    console.log(data);
    if(!res.ok) {
        throw new Error(data.message || 'Failed to fetch data');
    }

    return data.schedules;
}