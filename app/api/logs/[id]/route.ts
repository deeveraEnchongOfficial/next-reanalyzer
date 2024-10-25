import { NextRequest, NextResponse } from 'next/server';
import { EventLog } from '@prisma/client';
import { findUniqueRecord, updateRecord, deleteRecord } from '@/helpers/dbHelpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const log = await findUniqueRecord<EventLog>({
            model: 'eventLog',
            where: { id: params.id },
            include: { user: true },
        });

        if (!log) {
            return NextResponse.json({ error: 'Log not found' }, { status: 404 });
        }

        return NextResponse.json(log);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch log' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const { page, source } = body;

        const updatedLog = await updateRecord<EventLog>({
            model: 'eventLog',
            where: { id: params.id },
            data: { page, source },
        });

        return NextResponse.json(updatedLog);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update log' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const deletedLog = await deleteRecord<EventLog>({
            model: 'eventLog',
            where: { id: params.id },
        });

        return NextResponse.json(deletedLog);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
    }
}