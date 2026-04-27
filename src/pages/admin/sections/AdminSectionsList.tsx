import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash } from 'lucide-react'

export default function AdminSectionsList() {
  const [sections, setSections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSections()
  }, [])

  const loadSections = async () => {
    try {
      const records = await pb.collection('sections').getFullList({
        sort: 'created',
      })
      setSections(records)
    } catch (error) {
      console.error('Error loading sections:', error)
      toast({
        title: 'Error',
        description: 'Could not load sections.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return

    try {
      await pb.collection('sections').delete(id)
      toast({ title: 'Success', description: 'Section deleted successfully.' })
      loadSections()
    } catch (error) {
      console.error('Error deleting section:', error)
      toast({
        title: 'Error',
        description: 'Could not delete section.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Sections</h1>
        <Button asChild>
          <Link to="/admin/sections/new">
            <Plus className="w-4 h-4 mr-2" />
            New Section
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading sections...</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-16 px-4 border rounded-xl bg-card border-dashed">
          <h3 className="text-lg font-medium mb-2">No sections found</h3>
          <p className="text-muted-foreground mb-4">Create your first section to get started.</p>
          <Button asChild variant="outline">
            <Link to="/admin/sections/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Section
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {section.title || section.name || section.id}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(section.created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/sections/${section.id}`}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(section.id)}
                      >
                        <Trash className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
