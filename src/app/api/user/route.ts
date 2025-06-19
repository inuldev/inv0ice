import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/user.model";
import { onboardingSchema } from "@/lib/zodSchema";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // ✅ Validasi input di server
    const parsedData = onboardingSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsedData.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, currency } = parsedData.data;

    // 🔐 Cek autentikasi
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🗄️ Connect DB
    await connectDB();

    // 🔄 Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { firstName, lastName, currency },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
