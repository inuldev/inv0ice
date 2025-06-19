import { signIn } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/LoadingButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage() {
  return (
    <Card className="max-w-sm min-w-xs lg:min-w-sm">
      <CardHeader>
        <CardTitle className="text-xl w-full">Login</CardTitle>
        <CardDescription>
          Enter your email below to login in your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-6"
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", formData);
          }}
        >
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              placeholder="hello@example.com"
              required
              type="email"
              name="email"
            />
          </div>
          <LoadingButton text="Login" />
        </form>
      </CardContent>
    </Card>
  );
}
