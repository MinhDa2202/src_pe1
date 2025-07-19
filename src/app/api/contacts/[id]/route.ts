import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const contact = await Contact.findById(params.id);
    if (!contact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contact', error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedContact = await Contact.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updatedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating contact', error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const deletedContact = await Contact.findByIdAndDelete(params.id);
    if (!deletedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting contact', error }, { status: 500 });
  }
}