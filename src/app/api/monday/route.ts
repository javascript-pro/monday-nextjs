// app/api/monday/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

interface MondayResponse {
    data: {
        boards: Array<{
            id: string;
            name: string;
            items: Array<{
                id: string;
                name: string;
                column_values: Array<{
                    id: string;
                    title: string;
                    text: string;
                }>;
            }>;
        }>;
    };
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
        const query = `query {
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
        }`;
        
        const response = await axios.post<MondayResponse>(
            'https://api.monday.com/v2',
            { query },
            { headers }
        );
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
