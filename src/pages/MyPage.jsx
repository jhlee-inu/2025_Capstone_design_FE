import BottomTab from "../components/BottomTab";

function mypage() {
    return (
    <div className="flex flex-col min-h-screen">
        {/* 헤더 */}    
        <header className="h-14 flex items-center px-4 border-b bg-white z-10">
            <h1 className="text-lg font-bold">마이페이지</h1>
        </header>
        {/* 콘텐츠 영역 */}
        <main className="flex-1 p-4 bg-gray-50">
            <p>마이페이지 콘텐츠가 여기에 표시됩니다.</p>
        </main>
        {/* 하단 탭 */}
        <BottomTab />
    </div>
    );  
}   
export default mypage;