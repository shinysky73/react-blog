import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { FilePenLine, ShieldCheck, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            나만의 블로그, 나만의 생각
          </h1>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl mt-4">
            Blog System에서 당신의 지식과 경험을 공유하세요.
            {/* 손쉽게 글을 작성하고 관리할 수 있습니다. */}
          </p>
          <div className="mt-8">
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button size="lg">
                {isAuthenticated ? "대시보드로 이동" : "지금 시작하기"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 md:py-24 lg:py-10">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            주요 기능
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <FilePenLine className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="pt-4">손쉬운 게시물 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  직관적인 인터페이스를 통해 손쉽게 글을 작성, 수정, 삭제하고
                  당신의 생각을 세상과 공유하세요.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="pt-4">안전한 계정 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  JWT 기반의 안정적인 인증 시스템으로 당신의 계정과 콘텐츠를
                  안전하게 보호합니다.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <LogIn className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="pt-4">간편한 시작</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  복잡한 절차 없이 이메일과 비밀번호만으로 간편하게 가입하고
                  바로 블로깅을 시작할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
