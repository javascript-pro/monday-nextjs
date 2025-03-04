import { NextResponse } from "next/server";

const MONDAY_API_URL = "https://api.monday.com/v2";
const MONDAY_API_KEY = process.env.MONDAY_API_KEY as string; // Ensure you set this in .env

// Mapping status text to corresponding Monday.com column values (adjust if needed)
const STATUS_MAPPING: Record<string, number> = {
  "To Do": 0, // Adjust based on your Monday board setup
  "In Progress": 1,
  "Done": 2,
};

export async function POST(req: Request) {
  try {
    const { itemId, newStatus } = await req.json();

    if (!itemId || !newStatus) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const statusIndex = STATUS_MAPPING[newStatus];
    if (statusIndex === undefined) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // GraphQL mutation to update status
    const mutation = `
      mutation {
        change_simple_column_value(
          item_id: ${itemId}, 
          board_id: 8614115261, 
          column_id: "status", 
          value: ${statusIndex}
        ) {
          id
        }
      }
    `;

    const response = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY,
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      throw new Error(result.errors ? result.errors[0].message : "Failed to update status");
    }

    // Fetch the updated board after mutation
    const updatedBoardQuery = `
      query {
        boards(ids: [8614115261]) {
          id
          name
          items_page {
            items {
              id
              name
              column_values {
                id
                text
                value
              }
            }
          }
        }
      }
    `;

    const boardResponse = await fetch(MONDAY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: MONDAY_API_KEY,
      },
      body: JSON.stringify({ query: updatedBoardQuery }),
    });

    const updatedBoardData = await boardResponse.json();
    if (!boardResponse.ok || updatedBoardData.errors) {
      throw new Error(
        updatedBoardData.errors ? updatedBoardData.errors[0].message : "Failed to fetch updated board"
      );
    }

    return NextResponse.json(updatedBoardData.data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
