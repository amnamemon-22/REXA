import { ContactRound, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const columns = [
  'Student name',
  'Student ID',
  'Section',
  'Total analyses',
  'Average score',
  'Last activity',
]

export function StudentRecordsPage() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <PageHeader
        title="Student records"
        description="Find student accounts and review their analysis history."
      />

      <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
        <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
          <CardHeader className="border-b border-border/70 px-5 py-5 sm:px-6">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UsersRound className="h-5 w-5" aria-hidden="true" />
              </span>
              Class records
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <div className="overflow-hidden rounded-xl border border-border/80">
              <Table className="min-w-[850px]">
                <TableHeader className="bg-muted/60">
                  <TableRow className="hover:bg-muted/60">
                    {columns.map((column) => (
                      <TableHead key={column} className="h-12 whitespace-nowrap px-4 text-foreground/80">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="h-72 whitespace-normal p-6 text-center">
                      <div className="mx-auto flex max-w-md flex-col items-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <ContactRound className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h2 className="mt-4 text-base font-semibold text-foreground">
                          Student records are unavailable
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          A teacher-authorized roster and student analysis-history service is not available in the current integration. Connect that backend service to display real class records here.
                        </p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          No student accounts or analysis data are shown until they can be loaded from an authorized source.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
