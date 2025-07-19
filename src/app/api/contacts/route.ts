import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const group = searchParams.get('group');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (group) {
      filter.group = group;
    }

    const contacts = await Contact.find(filter).sort({ [sortBy]: sortOrder });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching contacts', error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const newContact = new Contact(body);
    await newContact.save();
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating contact', error }, { status: 500 });
  }
}