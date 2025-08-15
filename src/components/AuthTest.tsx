import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test basic connection
      const { data, error } = await supabase.from('workouts').select('count').limit(1);
      
      if (error) {
        setTestResult(`Connection error: ${error.message}`);
      } else {
        setTestResult('✅ Database connection successful!');
      }
    } catch (err) {
      setTestResult(`❌ Connection failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setTestResult('Testing auth...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setTestResult(`Auth error: ${error.message}`);
      } else {
        setTestResult(`Auth status: ${data.session ? 'Logged in' : 'Not logged in'}`);
      }
    } catch (err) {
      setTestResult(`❌ Auth test failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={testConnection} disabled={loading} className="w-full">
            Test Database Connection
          </Button>
          <Button onClick={testAuth} disabled={loading} className="w-full">
            Test Authentication
          </Button>
        </div>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">{testResult || 'Click a button to test...'}</p>
        </div>
      </CardContent>
    </Card>
  );
}

