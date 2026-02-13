"use client";

import { AppLayout } from "../../../components/layout/AppLayout";
import { Card, CardContent } from "../../../components/ui/card";

export default function ViewsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Saved Views</h1>
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Today&apos;s Tasks</h3>
                <p className="text-sm text-muted-foreground">Filter: Due Date = Today</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">High Priority</h3>
                <p className="text-sm text-muted-foreground">Filter: Priority = High</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
