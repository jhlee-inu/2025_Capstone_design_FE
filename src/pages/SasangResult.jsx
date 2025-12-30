function SasangResult() {
    return (
    <div className="flex flex-col min-h-screen">
        {/* 헤더 */}    
        <header className="h-14 flex items-center justify-center border-b bg-white z-10">
            <h1 className="text-lg font-bold">테스트 결과</h1>
        </header>
        {/* 콘텐츠 영역 */}
        <main className="flex-1 p-4 bg-gray-50">
            <p>사상의학 테스트 결과가 여기에 표시됩니다.</p>
        </main>
    </div>
    );  
}   
export default SasangResult;