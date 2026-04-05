import { useState, useEffect } from "react";
import { CATEGORY_GROUPS, getCategoriesByGroup } from "./categories";
import type { Category } from "./categories";
import type { GeneratedBook, GeneratedVisual, BookConcept } from "./types";
import { getAllBooks, getBooksByCategory, deleteBook } from "./lib/storage";
import { generateNewBook } from "./services/orchestrator";
import type { GenerationProgress } from "./services/orchestrator";

type View = "home" | "category" | "generating" | "book-detail";

function App() {
  const [view, setView] = useState<View>("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [books, setBooks] = useState<GeneratedBook[]>([]);
  const [categoryBooks, setCategoryBooks] = useState<GeneratedBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<GeneratedBook | null>(null);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [liveVisuals, setLiveVisuals] = useState<GeneratedVisual[]>([]);
  const [liveConcept, setLiveConcept] = useState<BookConcept | null>(null);

  useEffect(() => { loadBooks(); }, []);

  async function loadBooks() {
    const all = await getAllBooks();
    setBooks(all);
  }

  async function loadCategoryBooks(catId: string) {
    const list = await getBooksByCategory(catId);
    setCategoryBooks(list);
  }

  const openCategory = async (cat: Category) => {
    setSelectedCategory(cat);
    await loadCategoryBooks(cat.id);
    setView("category");
  };

  const startGeneration = async () => {
    if (!selectedCategory) return;
    setView("generating");
    setProgress(null); setLogs([]); setError("");
    setLiveVisuals([]); setLiveConcept(null);

    try {
      const book = await generateNewBook(selectedCategory, (p) => {
        setProgress(p);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString("tr-TR")}] ${p.message}`]);
        if (p.newVisual) setLiveVisuals(prev => [...prev, p.newVisual!]);
        if (p.concept) setLiveConcept(p.concept);
      });
      setSelectedBook(book);
      await loadBooks();
      await loadCategoryBooks(selectedCategory.id);
      setView("book-detail");
    } catch (err: any) {
      setError(err.message || "Üretim hatası");
    }
  };

  const removeBook = async (id: string) => {
    if (!confirm("Bu kitabı silmek istediğine emin misin?")) return;
    await deleteBook(id);
    await loadBooks();
    if (selectedCategory) await loadCategoryBooks(selectedCategory.id);
    if (selectedBook?.id === id) setView("category");
  };

  const downloadBookAssets = async (book: GeneratedBook) => {
    for (const visual of book.visuals) {
      const a = document.createElement("a");
      a.href = visual.imageUrl;
      a.download = `${book.concept.baslik}-${visual.type}.png`.replace(/[^a-zA-Z0-9.-]/g, "_");
      a.click();
      await new Promise(r => setTimeout(r, 200));
    }
    // Also download SEO content as JSON
    const blob = new Blob([JSON.stringify(book.seo, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${book.concept.baslik}-seo.json`.replace(/[^a-zA-Z0-9.-]/g, "_");
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <header className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setView("home")} className="flex items-center gap-2 font-display">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="font-bold text-lg text-purple-900 leading-none">MasalSensin</h1>
              <p className="text-[10px] font-mono text-purple-500 uppercase tracking-widest">Ürün Stüdyosu</p>
            </div>
          </button>
          <div className="text-xs text-purple-600 font-mono">
            {books.length} kitap üretildi
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === "home" && (
          <HomeView
            onCategoryClick={openCategory}
            books={books}
          />
        )}

        {view === "category" && selectedCategory && (
          <CategoryView
            category={selectedCategory}
            books={categoryBooks}
            onBack={() => setView("home")}
            onGenerate={startGeneration}
            onBookClick={(book) => { setSelectedBook(book); setView("book-detail"); }}
            onDelete={removeBook}
          />
        )}

        {view === "generating" && (
          <GeneratingView progress={progress} logs={logs} error={error} onRetry={startGeneration} onCancel={() => setView("category")} liveVisuals={liveVisuals} liveConcept={liveConcept} />
        )}

        {view === "book-detail" && selectedBook && (
          <BookDetailView
            book={selectedBook}
            onBack={() => setView("category")}
            onDownload={() => downloadBookAssets(selectedBook)}
            onDelete={() => removeBook(selectedBook.id)}
          />
        )}
      </main>
    </div>
  );
}

// ═══ HOME VIEW ═══
function HomeView({ onCategoryClick, books }: { onCategoryClick: (c: Category) => void; books: GeneratedBook[] }) {
  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h2 className="font-display text-3xl font-bold text-purple-900 mb-2">Otomatik Ürün Üretici</h2>
        <p className="text-purple-600">Kategori seç, AI 10 görsel + SEO içeriği üretsin</p>
      </div>

      {CATEGORY_GROUPS.map(group => (
        <div key={group.id}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{group.emoji}</span>
            <h3 className="font-display text-xl font-semibold text-purple-900">{group.label}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {getCategoriesByGroup(group.id).map(cat => {
              const count = books.filter(b => b.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryClick(cat)}
                  className="bg-white rounded-xl border border-purple-100 p-4 text-left hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-xs font-mono text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                      {count} kitap
                    </span>
                  </div>
                  <h4 className="font-semibold text-purple-900 mb-1">{cat.name}</h4>
                  <p className="text-xs text-purple-600 mb-2">{cat.description}</p>
                  <p className="text-[10px] font-mono text-purple-400">{cat.ageRange} yaş</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══ CATEGORY VIEW ═══
function CategoryView({ category, books, onBack, onGenerate, onBookClick, onDelete }: {
  category: Category;
  books: GeneratedBook[];
  onBack: () => void;
  onGenerate: () => void;
  onBookClick: (b: GeneratedBook) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
        ← Ana sayfa
      </button>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{category.emoji}</span>
            <h2 className="font-display text-2xl font-bold text-purple-900">{category.name}</h2>
          </div>
          <p className="text-purple-600 text-sm">{category.description}</p>
          <p className="text-xs font-mono text-purple-400 mt-1">{category.ageRange} yaş · {category.groupLabel}</p>
        </div>
        <button
          onClick={onGenerate}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          ✨ Yeni Kitap Üret
        </button>
      </div>

      <div>
        <h3 className="text-sm font-mono text-purple-500 uppercase tracking-widest mb-3">Üretilmiş Kitaplar ({books.length})</h3>
        {books.length === 0 ? (
          <div className="bg-white rounded-xl border border-purple-100 p-8 text-center">
            <p className="text-purple-400 mb-2">Henüz kitap üretilmedi</p>
            <p className="text-xs text-purple-300">İlk kitabını üretmek için yukarıdaki butona tıkla</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {books.map(book => {
              const cover = book.visuals.find(v => v.type === "hero");
              return (
                <div key={book.id} className="bg-white rounded-xl border border-purple-100 overflow-hidden hover:shadow-md transition-all relative group">
                  <button onClick={() => onBookClick(book)} className="block w-full text-left">
                    {cover && <img src={cover.imageUrl} alt={book.concept.baslik} className="w-full aspect-[2/3] object-cover" />}
                    <div className="p-3">
                      <p className="text-xs font-semibold text-purple-900 line-clamp-2">{book.concept.baslik}</p>
                      <p className="text-[10px] font-mono text-purple-400 mt-1">
                        {new Date(book.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(book.id); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ GENERATING VIEW ═══
function GeneratingView({ progress, logs, error, onRetry, onCancel, liveVisuals, liveConcept }: {
  progress: GenerationProgress | null;
  logs: string[];
  error: string;
  onRetry: () => void;
  onCancel: () => void;
  liveVisuals: GeneratedVisual[];
  liveConcept: BookConcept | null;
}) {
  const stages = ["concept", "cover", "products", "marketing", "seo", "done"];
  const currentIdx = progress ? stages.indexOf(progress.stage) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-700 font-semibold mb-2">❌ Hata Oluştu</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="flex gap-2">
            <button onClick={onRetry} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Tekrar Dene</button>
            <button onClick={onCancel} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">İptal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-purple-100 p-6">
            <div className="text-center mb-6">
              <div className="inline-block animate-spin text-4xl mb-2">✨</div>
              <h3 className="font-display text-xl font-bold text-purple-900 mb-1">Kitap Üretiliyor</h3>
              <p className="text-sm text-purple-600">{progress?.message || "Başlatılıyor..."}</p>
            </div>

            <div className="flex items-center justify-between">
              {["Konsept", "Kapak", "Ürün", "Pazarlama", "SEO", "Bitti"].map((label, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    i < currentIdx ? "bg-green-500 text-white" : i === currentIdx ? "bg-purple-600 text-white animate-pulse" : "bg-purple-100 text-purple-400"
                  }`}>
                    {i < currentIdx ? "✓" : i + 1}
                  </div>
                  <span className="text-[10px] text-purple-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {liveConcept && (
            <div className="bg-white rounded-xl border border-purple-100 p-4">
              <p className="text-[10px] font-mono text-purple-500 uppercase tracking-widest mb-1">Üretilen Kitap</p>
              <p className="font-display font-bold text-purple-900 text-lg">{liveConcept.baslik}</p>
              <p className="text-xs text-purple-600 mt-1">
                Kahraman: {liveConcept.kahraman.isim} · {liveConcept.kahraman.yas} yaş
              </p>
            </div>
          )}

          {liveVisuals.length > 0 && (
            <div className="bg-white rounded-xl border border-purple-100 p-4">
              <p className="text-[10px] font-mono text-purple-500 uppercase tracking-widest mb-2">
                Tamamlanan Görseller ({liveVisuals.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {liveVisuals.map(v => (
                  <div key={v.id} className="rounded-lg overflow-hidden border border-purple-100 bg-purple-50 relative group">
                    <img src={v.imageUrl} alt={v.label} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={v.imageUrl}
                        download={`${v.type}.png`}
                        className="bg-white text-purple-700 text-xs px-3 py-1 rounded-full font-semibold"
                      >
                        ⬇ İndir
                      </a>
                    </div>
                    <p className="text-xs font-medium text-purple-900 p-2">{v.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-purple-100 p-4">
            <p className="text-[10px] font-mono text-purple-500 uppercase tracking-widest mb-2">İşlem Logu</p>
            <div className="max-h-40 overflow-y-auto font-mono text-[11px] text-purple-700 space-y-0.5">
              {logs.map((log, i) => <p key={i}>{log}</p>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═══ BOOK DETAIL VIEW ═══
function BookDetailView({ book, onBack, onDownload, onDelete }: {
  book: GeneratedBook;
  onBack: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"visuals" | "seo" | "concept">("visuals");

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
        ← {book.category.name}
      </button>

      <div className="bg-white rounded-xl border border-purple-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{book.category.emoji}</span>
              <span className="text-xs font-mono text-purple-500 uppercase">{book.category.name}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-purple-900">{book.concept.baslik}</h2>
            <p className="text-sm text-purple-600 mt-1">{book.concept.ozet}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onDownload} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700">
              ⬇ Hepsini İndir
            </button>
            <button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              Sil
            </button>
          </div>
        </div>

        <div className="flex gap-4 border-b border-purple-100">
          {["visuals", "seo", "concept"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-purple-400"
              }`}
            >
              {tab === "visuals" ? `Görseller (${book.visuals.length})` : tab === "seo" ? "SEO Metin" : "Konsept"}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {activeTab === "visuals" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {book.visuals.map(v => (
                <div key={v.id} className="rounded-lg overflow-hidden border border-purple-100 bg-purple-50">
                  <img src={v.imageUrl} alt={v.label} className="w-full aspect-square object-cover" />
                  <p className="text-xs font-medium text-purple-900 p-2">{v.label}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-mono text-purple-500 uppercase mb-1">Ürün Başlığı</p>
                <p className="font-semibold text-purple-900">{book.seo.urunBasligi}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-purple-500 uppercase mb-1">Meta Description</p>
                <p className="text-purple-700">{book.seo.metaDescription}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-purple-500 uppercase mb-1">Kısa Açıklama</p>
                <p className="text-purple-700">{book.seo.kisaAciklama}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-purple-500 uppercase mb-1">Uzun Açıklama</p>
                <div className="text-purple-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: book.seo.uzunAciklama }} />
              </div>
              <div>
                <p className="text-xs font-mono text-purple-500 uppercase mb-1">Kazanımlar</p>
                <ul className="space-y-1">
                  {book.seo.kazanimlar.map((k, i) => (
                    <li key={i} className="text-purple-700"><strong>{k.baslik}:</strong> {k.aciklama}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-mono text-purple-500 uppercase mb-1">Anahtar Kelimeler</p>
                <div className="flex flex-wrap gap-1">
                  {book.seo.anahtarKelimeler.map((k, i) => (
                    <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "concept" && (
            <div className="text-sm space-y-2">
              <p><strong>Kahraman:</strong> {book.concept.kahraman.isim}, {book.concept.kahraman.yas} yaş ({book.concept.kahraman.cinsiyet})</p>
              <p><strong>Görünüm:</strong> {book.concept.kahraman.fizikselOzellikler}</p>
              <p><strong>Kıyafet:</strong> {book.concept.kahraman.kiyafet}</p>
              <p><strong>Mood:</strong> {book.concept.mood}</p>
              <div className="pt-2">
                <p className="font-semibold mb-1">Sahneler:</p>
                <ol className="list-decimal list-inside text-purple-700 space-y-0.5">
                  {book.concept.sahneler.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
