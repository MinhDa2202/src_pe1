import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

const getIdFromRequest = (req: NextRequest) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  return id;
};

export async function GET(req: NextRequest) {
  await dbConnect();
  const id = getIdFromRequest(req);
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contact', error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const id = getIdFromRequest(req);
  try {
    const body = await req.json();
    const updatedContact = await Contact.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating contact', error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const id = getIdFromRequest(req);
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Contact deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting contact', error }, { status: 500 });
  }
}
