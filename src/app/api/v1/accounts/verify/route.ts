import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountNumber, bankCode } = body;

    const response = await fetch(process.env.FLUTTERWAVE_RESOLVE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        account_bank: bankCode,
      }),
    });

    const data = await response.json();
    console.log("data: ", data);

    if (data.status === "success") {
      return NextResponse.json({
        success: true,
        data: {
          accountName: data.data.account_name,
          accountNumber: data.data.account_number,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to verify account",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify account",
      },
      { status: 500 },
    );
  }
}
