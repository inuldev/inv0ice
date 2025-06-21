"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Upload, Check, AlertCircle } from "lucide-react";

import imagebase64 from "@/lib/imagebase64";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TSignatureData = {
  name: string;
  image: string;
};

export default function SettingsPage() {
  const [logo, setLogo] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [signatureData, setSignatureData] = useState<TSignatureData>({
    name: "",
    image: "",
  });

  //handle on change signature : eg. name
  const onChangeSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignatureData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  //handle on change signature image
  const handleSignatureImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length < 0) return;

    const file = files[0];
    //image to base64
    const image = await imagebase64(file);

    setSignatureData((preve) => {
      return {
        ...preve,
        image: image,
      };
    });
  };

  //handle on change logo
  const handleOnChangeLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length < 0) return;

    const file = files[0];
    //image to base64
    const image = await imagebase64(file);

    setLogo(image);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/settings");
      const responseData = await response.json();

      if (response.status === 200) {
        setLogo(responseData?.data?.invoiceLogo);
        setSignatureData(
          responseData?.data?.signature || { name: "", image: "" }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    data: any
  ) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        toast.success("Setting updated Successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your invoice branding and signature settings
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Both logo and signature are required to generate PDF invoices. Make
          sure to upload both before creating invoices.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Invoice Logo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Invoice Logo
            </CardTitle>
            <CardDescription>
              Upload your company logo that will appear on invoices. Recommended
              size: 300x100px (3:1 ratio)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => handleSubmit(e, { logo })}
            >
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Logo File</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleOnChangeLogo}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, SVG. Max size: 2MB
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 bg-muted/10">
                  {logo ? (
                    <div className="flex items-center justify-center">
                      <Image
                        src={logo}
                        width={200}
                        height={67}
                        alt="Invoice logo preview"
                        className="max-h-16 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Upload className="h-8 w-8 mb-2" />
                      <p className="text-sm">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !logo}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Logo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Invoice Signature Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Invoice Signature
            </CardTitle>
            <CardDescription>
              Add your signature and name that will appear at the bottom of
              invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => handleSubmit(e, { signature: signatureData })}
            >
              <div className="space-y-2">
                <Label htmlFor="signature-name">Signature Name</Label>
                <Input
                  id="signature-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signatureData.name}
                  onChange={onChangeSignature}
                  name="name"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature-upload">Signature Image</Label>
                <Input
                  id="signature-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureImage}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear signature image. Recommended: transparent
                  background PNG
                </p>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 bg-muted/10">
                  {signatureData.image || signatureData.name ? (
                    <div className="space-y-3">
                      {signatureData.image && (
                        <div className="flex items-center justify-center">
                          <Image
                            src={signatureData.image}
                            width={150}
                            height={50}
                            alt="Signature preview"
                            className="max-h-12 w-auto object-contain"
                          />
                        </div>
                      )}
                      {signatureData.name && (
                        <div className="text-center">
                          <p className="font-medium text-sm border-t pt-2 inline-block px-4">
                            {signatureData.name}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Upload className="h-8 w-8 mb-2" />
                      <p className="text-sm">No signature uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  isLoading || (!signatureData.name && !signatureData.image)
                }
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Signature
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
