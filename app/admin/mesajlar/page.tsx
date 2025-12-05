import { getContactMessages } from "@/lib/actions/contact";
import { MessagesTable } from "./messages-table";

export default async function MessagesPage() {
    const messages = await getContactMessages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gelen Kutusu</h1>
                    <p className="text-slate-500">Müşteri mesajlarını yönetin.</p>
                </div>
            </div>

            <MessagesTable initialMessages={messages} />
        </div>
    );
}
