import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CreateAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleCreateAdmin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          email: 'admin@petmate.com',
          password: 'admin@123'
        }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult("Admin user created successfully! You can now log in with the admin credentials.");
    } catch (error: any) {
      console.error('Error creating admin:', error);
      setResult(`Failed to create admin user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            This will create a default admin user with the following credentials:
            <br />
            Email: admin@petmate.com
            <br />
            Password: admin@123
          </p>
          
          <Button 
            className="w-full" 
            onClick={handleCreateAdmin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin...
              </>
            ) : (
              "Create Admin User"
            )}
          </Button>

          {result && (
            <p className={`text-sm ${result.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {result}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdmin; 