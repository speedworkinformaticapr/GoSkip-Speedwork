import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const records = await pb.collection('courses').getFullList({
          sort: '-created',
        })
        setCourses(records)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in min-h-screen">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-extrabold text-foreground mb-4">Campos de Footgolf</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Conheça os campos onde o esporte é praticado.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full shadow-md" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-xl border border-border flex flex-col items-center justify-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-lg text-muted-foreground font-medium">
            Nenhum campo encontrado no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{course.name || course.title || 'Campo'}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {course.city || course.location || 'Localização não informada'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description || 'Nenhuma descrição disponível.'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
