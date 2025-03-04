// app/api/monday/route.ts
import { NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

interface ColumnValue {
    id: string;
    title: string;
    text: string;
}

interface Item {
    id: string;
    name: string;
    column_values: ColumnValue[];
}

interface Board {
    id: string;
    name: string;
    items: Item[];
}

interface MondayData {
    boards: Board[];
}

interface MondayResponse {
    data: MondayData;
}

export async function GET(): Promise<NextResponse> {
    const { MONDAY_API_TOKEN } = process.env;
    if (!MONDAY_API_TOKEN) {
        return NextResponse.json({ error: 'Missing Monday API Token' }, { status: 500 });
    }

    const headers = {
        Authorization: MONDAY_API_TOKEN,
        'Content-Type': 'application/json'
    };

    try {
        const query = JSON.stringify({
            query: `query {
                boards {
                    id
                    name
                    items {
                        id
                        name
                        column_values {
                            id
                            title
                            text
                        }
                    }
                }
            }`
        });
        
        const response: AxiosResponse<MondayResponse> = await axios.post(
            'https://api.monday.com/v2',
            query,
            { headers }
        );
        return NextResponse.json(response.data.data, { status: 200 });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json({ error: error.response.data }, { status: error.response.status });
        }
        return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
}
