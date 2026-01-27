import HeadphoneScroll from "@/components/HeadphoneScroll";

export default function Home() {
    return (
        <main className="bg-[#050505] min-h-screen">
            <HeadphoneScroll />

            {/* Footer or extra content could go here, but for this landing page, the scroll experience is the main event. */}
            {/* Adding a spacer just in case to show end of flow if needed, but 400vh is usually enough. */}
        </main>
    );
}
