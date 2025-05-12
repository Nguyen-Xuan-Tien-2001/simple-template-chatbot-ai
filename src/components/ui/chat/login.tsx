'use client';
import BackgroundImg from "@/public/LoginImage.png";
import Logo from "@/public/HPT_Logo.png";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner"


interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (data: LoginFormData) => {
    if (data.username === "admin" && data.password === "admin") {
      localStorage.setItem("user_id", "988b5c3b-4d21-4c0f-bddb-73957057b667");
      router.push("/chatbot");
    }
    else {
      toast("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-center">
          <a
            type="blank"
            href="https://hpt.vn/"
            className=" text-3xl flex items-center gap-2 font-medium  text-red-500"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-md text-primary-foreground">
              <Image src={Logo} alt="Logo" width={64} height={64} />
            </div>
            HPT VIETNAM CORPORATION
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onLoginSubmit={handleLogin} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={BackgroundImg}
          alt="Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
