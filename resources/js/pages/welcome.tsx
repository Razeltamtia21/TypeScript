import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Award,
    BarChart3,
    Book,
    Building,
    Calendar,
    CheckCircle,
    ChevronRight,
    ChevronDown,
    DollarSign,
    Facebook,
    FileCheck,
    FileText,
    Globe,
    Headphones,
    HelpCircle,
    Instagram,
    Linkedin,
    LogOut,
    Mail,
    MapPin,
    Menu,
    MessageSquare,
    Moon,
    Pause,
    Phone,
    Play,
    Shield,
    Star,
    Sun,
    Twitter,
    User,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Variasi animasi untuk elemen-elemen
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
};
const heroImageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100, delay: 0.5 } },
};
const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
};

export default function PSAKLanding({ auth, ziggy }) {
    const [isDark, setIsDark] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalSlides, setModalSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [autoSlide, setAutoSlide] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    // State untuk artikel
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    
    // Ref untuk menyimpan ID interval
    const intervalRef = useRef(null);
    
    // Check if user is authenticated
    const isAuthenticated = auth && auth.user;
    
    // Redirect to dashboard if user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.get('/dashboard'); // Arahkan ke dashboard
        }
    }, [isAuthenticated]);
    
    // Fungsi untuk mereset timer auto-slide
    const resetAutoSlideTimer = () => {
        if (autoSlide && showModal && modalSlides.length > 1) {
            // Hapus interval yang ada
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            // Buat interval baru
            intervalRef.current = setInterval(() => {
                goToNextSlide();
            }, 5000); // Ganti slide setiap 5 detik
        }
    };
    
    useEffect(() => {
        // Baca preferensi tema dari localStorage saat komponen dimuat
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        } else if (savedTheme === 'light') {
            setIsDark(false);
        } else {
            // Jika belum ada preferensi tersimpan, gunakan preferensi sistem
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
        }
    }, []);
    
    useEffect(() => {
        // Terapkan tema ke DOM dan simpan ke localStorage
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    
    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu')) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showUserMenu]);
    
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showModal && !showArticleModal) return;
            if (e.key === 'ArrowRight') {
                if (showModal) goToNextSlide();
            } else if (e.key === 'ArrowLeft') {
                if (showModal) goToPrevSlide();
            } else if (e.key === 'Escape') {
                if (showModal) closeModal();
                if (showArticleModal) closeArticleModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showModal, showArticleModal, currentSlideIndex, modalSlides]);
    
    // Auto-slide functionality
    useEffect(() => {
        if (showModal && autoSlide && modalSlides.length > 1) {
            intervalRef.current = setInterval(() => {
                goToNextSlide();
            }, 5000); // Ganti slide setiap 5 detik
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [showModal, autoSlide, modalSlides]);
    
    const toggleTheme = () => setIsDark((prev) => !prev);
    
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
        setIsMenuOpen(false);
    };
    
    // Touch handlers for swipe gestures
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };
    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            // Swipe left
            goToNextSlide();
        } else if (touchEnd - touchStart > 50) {
            // Swipe right
            goToPrevSlide();
        }
    };
    
    // Fungsi untuk logout
    const handleLogout = () => {
        // Menggunakan Inertia.js untuk logout
        router.post(route('logout'));
    };
    
    // Fungsi untuk menyiapkan semua slide modal
    const getAllModalSlides = () => {
        return [
            {
                title: 'Tentang PSAK 109',
                icon: <Book className="mx-auto mb-4 h-16 w-16 text-blue-600" />,
                description:
                    'PSAK 109 tentang Instrumen Keuangan adalah standar akuntansi yang mengatur pengakuan, pengukuran, penyajian, dan pengungkapan instrumen keuangan.',
                features: [
                    'Klasifikasi dan Pengukuran Aset Keuangan',
                    'Penurunan Nilai (Impairment) - Expected Credit Loss Model',
                    'Akuntansi Lindung Nilai (Hedge Accounting)',
                    'Pengungkapan Risiko dan Fair Value',
                ],
                benefits: [
                    'Standar internasional yang diakui global',
                    'Peningkatan transparansi pelaporan keuangan',
                    'Manajemen risiko yang lebih baik',
                    'Kepercayaan stakeholder yang meningkat',
                ],
            },
            {
                title: 'Transparansi dalam Pelaporan',
                icon: <Shield className="mx-auto mb-4 h-16 w-16 text-blue-600" />,
                description: 'PSAK 109 mengatur standar pelaporan yang jelas dan dapat dipertanggungjawabkan sesuai dengan standar internasional.',
                features: [
                    'Pelaporan keuangan yang sesuai dengan standar IFRS',
                    'Transparansi dalam pengungkapan risiko kredit',
                    'Dokumentasi yang lengkap dan terstruktur',
                    'Audit trail yang dapat dilacak',
                ],
                benefits: [
                    'Meningkatkan kepercayaan investor',
                    'Memudahkan proses audit',
                    'Meminimalkan risiko regulasi',
                    'Meningkatkan kredibilitas perusahaan',
                ],
            },
            {
                title: 'Akurasi dan Keandalan Sistem',
                icon: <DollarSign className="mx-auto mb-4 h-16 w-16 text-green-600" />,
                description: 'Sistem yang terpercaya dengan tingkat akurasi tinggi untuk semua perhitungan dan analisis keuangan.',
                features: [
                    'Kalkulasi otomatis Expected Credit Loss (ECL)',
                    'Model probabilitas default yang akurat',
                    'Validasi data real-time',
                    'Backup dan recovery otomatis',
                ],
                benefits: ['Mengurangi human error', 'Proses yang lebih efisien', 'Keputusan berdasarkan data akurat', 'Compliance yang terjamin'],
            },
            {
                title: 'Platform Online yang User-Friendly',
                icon: <Globe className="mx-auto mb-4 h-16 w-16 text-purple-600" />,
                description: 'Akses mudah dari mana saja dengan platform online yang intuitif dan responsif.',
                features: [
                    'Dashboard interaktif dan responsive',
                    'Multi-device compatibility',
                    'Cloud-based infrastructure',
                    'Real-time data synchronization',
                ],
                benefits: [
                    'Akses 24/7 dari mana saja',
                    'Kolaborasi tim yang lebih baik',
                    'Skalabilitas yang fleksibel',
                    'Update otomatis tanpa downtime',
                ],
            },
            {
                title: 'Dukungan Profesional 24/7',
                icon: <Headphones className="mx-auto mb-4 h-16 w-16 text-orange-600" />,
                description: 'Tim support profesional siap membantu 24/7 untuk semua kebutuhan implementasi dan operasional.',
                features: [
                    'Support multi-channel (chat, email, phone)',
                    'Tim ahli bersertifikat',
                    'Training dan workshop reguler',
                    'Knowledge base yang komprehensif',
                ],
                benefits: ['Implementasi yang lancar', 'Minimize learning curve', 'Continuous improvement', 'Peace of mind'],
            },
        ];
    };
    
    // Data artikel
    const articles = [
        {
            id: 1,
            title: 'Standar Akuntansi Baru PSAK 71, 72, dan 73 Berlaku 2020, Ini Perbedaannya',
            category: 'Artikel',
            date: '9 Mei 2019',
            image: 'https://foto.kontan.co.id/-k5LqFr43LWfCA6MeCJryGdNDc4=/640x360/smart/2019/05/09/1569148205p.jpg',
            excerpt: 'Ketiga PSAK itu memiliki poin masing-masing. PSAK 71 misalnya mengatur mengenai instrumen keuangan...',
            content: `
                <h3 className="text-2xl font-bold text-center mb-4">Standar Akuntansi Baru PSAK 71, 72, dan 73 Berlaku 2020: Ini Perbedaannya</h3>
                <p className="mb-4 text-center">Ketiga PSAK ini memiliki poin masing-masing. PSAK 71 mengatur mengenai instrumen keuangan, PSAK 72 mengatur mengenai pendapatan dari kontrak dengan pelanggan, dan PSAK 73 mengatur mengenai sewa. Berikut adalah detail perubahan yang harus diadopsi berdasarkan masing-masing PSAK tersebut.</p>
                
                <h3 className="text-xl font-bold mt-6 mb-3">PSAK 71</h3>
                <p className="mb-4">Standar Akuntansi Keuangan (PSAK) 71 memberikan panduan tentang pengakuan dan pengukuran instrumen keuangan. Standar ini mengacu kepada International Financial Reporting Standard (IFRS) 9 dan akan menggantikan PSAK 55 yang sebelumnya berlaku. Selain klasifikasi aset keuangan, salah satu poin penting PSAK 71 adalah pencadangan atas penurunan nilai aset keuangan, yang mencakup piutang, pinjaman, atau kredit.</p>
                <p className="mb-4">Standar baru ini mengubah secara mendasar metode penghitungan dan penyediaan cadangan untuk kerugian akibat pinjaman yang tak tertagih. Berdasarkan PSAK 55, kewajiban pencadangan baru muncul setelah terjadi peristiwa yang mengakibatkan risiko gagal bayar (incurred loss). Namun, PSAK 71 memandatkan korporasi untuk menyediakan pencadangan sejak awal periode kredit. Dasar pencadangan kini adalah ekspektasi kerugian kredit (expected credit loss) di masa mendatang, yang mempertimbangkan berbagai faktor, termasuk proyeksi ekonomi.</p>
                
                <h3 className="text-xl font-bold mt-6 mb-3">PSAK 72</h3>
                <p className="mb-4">PSAK 72 tentang Pengakuan Pendapatan dari Kontrak dengan Pelanggan merupakan adopsi IFRS 15 yang telah berlaku di Eropa sejak Januari 2018. PSAK 72 disebut sebagai PSAK "sapu jagat" karena mengganti banyak standar sebelumnya. Beberapa standar yang dicabut dengan terbitnya PSAK 72 meliputi:</p>
                <ul className="list-square pl-5 mb-4 space-y-2">
                    <li>PSAK 34 tentang Kontrak Konstruksi</li>
                    <li>PSAK 32 tentang Pendapatan</li>
                    <li>ISAK 10 tentang Program Loyalitas Pelanggan</li>
                    <li>ISAK 21 tentang Perjanjian Konstruksi Real Estate</li>
                    <li>ISAK 27 tentang Pengalihan Aset dari Pelanggan</li>
                </ul>
                
                <h3 className="text-xl font-bold mt-6 mb-3">PSAK 73</h3>
                <p className="mb-4">Standar baru ini akan mengubah secara substansial pembukuan transaksi sewa dari sisi penyewa (lessee). Berdasarkan PSAK 73, korporasi penyewa diwajibkan membukukan hampir semua transaksi sewanya sebagai sewa finansial (financial lease). Pembukuan sewa operasi (operating lease) hanya boleh dilakukan untuk transaksi sewa yang memenuhi dua syarat:</p>
                <ul className="list-square pl-5 mb-4 space-y-2">
                    <li>Berjangka pendek (di bawah 12 bulan)</li>
                    <li>Bernilai rendah (misalnya sewa ponsel, laptop, dan sejenisnya)</li>
                </ul>
                
                <p className="mt-4 text-center">Untuk informasi lebih lanjut, silakan kunjungi: 
                <a href='https://investasi.kontan.co.id/news/standarisasi-akuntansi-baru-psak-71-72-dan-73-berlaku-2020-ini-perbedaannya?page=3' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 underline'>Standarisasi Akuntansi Baru PSAK 71, 72, dan 73 Berlaku 2020</a></p>
            `,
        },
        {
            id: 2,
            title: 'Siaran Pers: OJK Keluarkan Panduan Penerapan PSAK 71 dan PSAK 68',
            category: 'Siaran Pers',
            date: '16 Apr 2020',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnm4qQdkl51Ld9ms0Rw3ilQhQY9ZCdm_EqCg&s',
            excerpt: 'Siaran Pers OJK Keluarkan Panduan Penerapan PSAK 71 Dan PSAK 68 Untuk Perbankan...',
            content: `
                <h4 className="text-lg font-bold text-center mb-2">Siaran Pers:</h4>
                <h3 className="text-2xl font-bold text-center mb-4">OJK Keluarkan Panduan Penerapan PSAK 71 dan PSAK 68 untuk Perbankan di Masa Pandemi Covid-19</h3>
                <p className="mb-4">Jakarta, 15 April 2020, Otoritas Jasa Keuangan (OJK) telah mengeluarkan panduan perlakuan akuntansi terutama dalam penerapan PSAK 71-Instrumen Keuangan dan PSAK 68-Pengukuran Nilai Wajar. Panduan ini dikeluarkan terkait dengan dampak pandemi Covid-19 yang telah menimbulkan ketidakpastian ekonomi global dan domestik serta secara signifikan memengaruhi pertimbangan entitas dalam menyusun laporan keuangan. Surat Edaran mengenai hal tersebut ditandatangani oleh Kepala Eksekutif Pengawas Perbankan OJK, Heru Kristiyana.</p>
                <p className="mb-4">Surat tersebut mengacu pada POJK No. 11/POJK.03/2020 serta panduan Dewan Standar Akuntansi Keuangan - Ikatan Akuntan Indonesia (DSAK-IAI) pada tanggal 2 April 2020 tentang Dampak Pandemi Covid-19 terhadap Penerapan PSAK 8 - Peristiwa setelah Periode Pelaporan dan PSAK 71 - Instrumen Keuangan. Oleh karena itu, kepada perbankan diminta untuk:</p>
                <ul className="list-square pl-5 mb-4 space-y-2">
                    <li>Mematuhi dan melaksanakan POJK No. 11/POJK.03/2020 serta secara proaktif mengidentifikasi debitur-debitur yang selama ini berkinerja baik namun menurun kinerjanya karena terdampak Covid-19.</li>
                    <li>Menerapkan skema restrukturisasi mengacu pada hasil asesmen yang akurat disesuaikan dengan profil debitur, dengan jangka waktu maksimal 1 (satu) tahun, dan hanya diberikan kepada debitur yang benar-benar terdampak Covid-19.</li>
                    <li>Menggolongkan debitur yang mendapatkan skema restrukturisasi dalam Stage-1 dan tidak diperlukan tambahan Cadangan Kerugian Penurunan Nilai (CKPN).</li>
                    <li>Melakukan identifikasi dan monitoring secara berkelanjutan serta siap untuk membentuk CKPN apabila debitur yang telah mendapatkan fasilitas restrukturisasi berkinerja baik pada awalnya, namun diperkirakan menurun karena terdampak Covid-19 dan tidak dapat pulih pasca restrukturisasi</li>
                </ul>
                
                <p className="mb-4">Selain itu, OJK, dengan mempertimbangkan release DSAK-IAI tanggal 5 April tentang Dampak Pandemi Covid-19 terhadap PSAK 68 - Pengukuran Nilai Wajar, juga memberikan panduan penyesuaian bagi perbankan dalam pengukuran nilai wajar, khususnya terkait penilaian surat-surat berharga. Hal ini mengingat tingginya volatilitas dan penurunan signifikan volume transaksi di bursa efek yang mempengaruhi pertimbangan bank dalam menentukan nilai wajar surat berharga. Panduan yang diberikan kepada bank adalah:</p>
                <ul className="list-square pl-5 mb-4 space-y-2">
                    <li>Menunda penilaian yang mengacu pada harga pasar (mark to market) untuk Surat Utang Negara dan surat-surat berharga lain yang diterbitkan Pemerintah, termasuk surat berharga yang diterbitkan oleh Bank Indonesia, selama 6 (enam) bulan. Selama masa penundaan, perbankan dapat menggunakan harga kuotasian tanggal 31 Maret 2020 untuk penilaian surat-surat berharga tersebut.</li>
                    <li>Menunda penilaian yang mengacu pada harga pasar untuk surat-surat berharga lain selama 6 (enam) bulan, sepanjang perbankan meyakini kinerja penerbit (issuer) surat-surat berharga tersebut dinilai baik sesuai kriteria tertentu. Jika kinerja penerbit dinilai tidak/kurang baik, perbankan dapat melakukan penilaian berdasarkan model sendiri dengan menggunakan asumsi seperti suku bunga, credit spread, dan risiko kredit penerbit.</li>
                    <li>Melakukan pengungkapan yang menjelaskan perbedaan perlakuan akuntansi yang mengacu pada panduan OJK dengan SAK sebagaimana dipersyaratkan dalam PSAK 68.</li>
                </ul>
                
                <p className="mt-4 text-center">Untuk informasi lebih lanjut, Anda dapat membaca siaran pers lengkapnya di 
                <a href='https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Siaran-Pers-OJK-Keluarkan-Panduan-Penerapan-PSAK-71-dan-PSAK-68-untuk-Perbankan-di-Masa-Pandemi-Covid--19.aspx' target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:text-blue-800 underline'>sini.</a></p>
            `,
        },
    ];
    
    // Fungsi untuk menampilkan detail layanan
    const showServiceDetail = (service) => {
        const allSlides = getAllModalSlides();
        // Cari index slide yang sesuai dengan service
        let index = 0;
        if (service === 'Transparansi') index = 1;
        else if (service === 'Akurasi dan Keandalan') index = 2;
        else if (service === 'Mudah Online') index = 3;
        else if (service === 'Dukungan Terdepan') index = 4;
        setModalSlides(allSlides);
        setCurrentSlideIndex(index);
        setShowModal(true);
    };
    
    // Fungsi untuk hero section "Pelajari Lebih Lanjut"
    const showPSAKInfo = () => {
        const allSlides = getAllModalSlides();
        setModalSlides(allSlides);
        setCurrentSlideIndex(0); // Tentang PSAK 109 adalah slide pertama
        setShowModal(true);
    };
    
    // Fungsi untuk menampilkan artikel
    const showArticleDetail = (article) => {
        setSelectedArticle(article);
        setShowArticleModal(true);
    };
    
    // Fungsi untuk menutup modal artikel
    const closeArticleModal = () => {
        setShowArticleModal(false);
        setSelectedArticle(null);
    };
    
    // Fungsi navigasi slide
    const goToNextSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % modalSlides.length);
        resetAutoSlideTimer(); // Reset timer setelah navigasi manual
    };
    const goToPrevSlide = () => {
        setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + modalSlides.length) % modalSlides.length);
        resetAutoSlideTimer(); // Reset timer setelah navigasi manual
    };
    const closeModal = () => {
        setShowModal(false);
        setModalSlides([]);
        setCurrentSlideIndex(0);
    };
    
    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-white'}`}>
            {/* Modal Artikel */}
            {showArticleModal && selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
                    >
                        <button
                            onClick={closeArticleModal}
                            className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="p-8">
                            <div className="mb-6 flex items-center space-x-3">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {selectedArticle.category}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{selectedArticle.date}</span>
                            </div>
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{selectedArticle.title}</h2>
                            {/* Gambar dengan tampilan yang lebih baik */}
                            <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
                                <div className="relative h-[500px] w-full">
                                    <img
                                        src={selectedArticle.image}
                                        alt={selectedArticle.title}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>
                            </div>
                            {/* Custom styling untuk artikel content */}
                            <div
                                className="prose prose-lg article-content max-w-none text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                            />
                            <div className="mt-8 flex justify-end">
                                <motion.button
                                    onClick={closeArticleModal}
                                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Tutup
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            
            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
                    >
                        {/* Auto-slide toggle button */}
                        <button
                            onClick={() => setAutoSlide(!autoSlide)}
                            className="absolute top-4 left-4 z-10 rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                            title={autoSlide ? 'Pause auto-slide' : 'Play auto-slide'}
                        >
                            {autoSlide ? (
                                <Pause size={20} className="text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Play size={20} className="text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlideIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                className="p-8"
                            >
                                {modalSlides[currentSlideIndex].icon}
                                <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                                    {modalSlides[currentSlideIndex].title}
                                </h2>
                                {/* Indikator slide yang lebih interaktif */}
                                <div className="mb-6 flex justify-center space-x-2">
                                    {modalSlides.map((_, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => {
                                                setCurrentSlideIndex(index);
                                                resetAutoSlideTimer(); // Reset timer setelah navigasi manual
                                            }}
                                            className={`h-2 w-2 rounded-full ${index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                    ))}
                                </div>
                                <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-300">
                                    {modalSlides[currentSlideIndex].description}
                                </p>
                                <div className="grid gap-8 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                                            <FileText size={20} className="mr-2 text-blue-600" />
                                            Fitur Utama
                                        </h3>
                                        <ul className="space-y-3">
                                            {modalSlides[currentSlideIndex].features?.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></div>
                                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900 dark:text-white">
                                            <Award size={20} className="mr-2 text-green-600" />
                                            Manfaat
                                        </h3>
                                        <ul className="space-y-3">
                                            {modalSlides[currentSlideIndex].benefits?.map((benefit, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-600"></div>
                                                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                {/* Navigasi slide yang lebih jelas */}
                                <div className="mt-8 flex items-center justify-between">
                                    <motion.button
                                        onClick={goToPrevSlide}
                                        disabled={currentSlideIndex === 0}
                                        className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                                            currentSlideIndex === 0
                                                ? 'border border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                        whileHover={currentSlideIndex !== 0 ? { scale: 1.05 } : {}}
                                        whileTap={currentSlideIndex !== 0 ? { scale: 0.95 } : {}}
                                    >
                                        <ArrowRight size={16} className="rotate-180" />
                                        <span>Sebelumnya</span>
                                    </motion.button>
                                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                                        {currentSlideIndex + 1} / {modalSlides.length}
                                    </div>
                                    <motion.button
                                        onClick={goToNextSlide}
                                        disabled={currentSlideIndex === modalSlides.length - 1}
                                        className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-semibold transition-colors ${
                                            currentSlideIndex === modalSlides.length - 1
                                                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                        whileHover={currentSlideIndex !== modalSlides.length - 1 ? { scale: 1.05 } : {}}
                                        whileTap={currentSlideIndex !== modalSlides.length - 1 ? { scale: 0.95 } : {}}
                                    >
                                        <span>Selanjutnya</span>
                                        <ArrowRight size={16} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
            
            {/* Navigation */}
            <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                <img
                                    src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/d220ce67a030b660bb79789bee54dc33.jpg"
                                    alt=""
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">PSAK 109</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Instrumen Keuangan</p>
                            </div>
                        </div>
                        
                        {/* Desktop Menu */}
                        <div className="hidden items-center space-x-8 md:flex">
                            <a
                                href="#beranda"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('beranda');
                                }}
                                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Beranda
                            </a>
                            <a
                                href="#layanan"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('layanan');
                                }}
                                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Layanan
                            </a>
                            <a
                                href="#artikel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('artikel');
                                }}
                                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Artikel
                            </a>
                            <a
                                href="#tentang"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('tentang');
                                }}
                                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Tentang
                            </a>
                            <a
                                href="#kontak"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('kontak');
                                }}
                                className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Kontak
                            </a>
                            
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            
                            {/* Auth Buttons - Tampilkan berdasarkan status login */}
                            <div className="flex items-center space-x-3">
                                {isAuthenticated ? (
                                    <div className="relative user-menu">
                                        <button
                                            onClick={() => setShowUserMenu(!showUserMenu)}
                                            className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <User size={20} />
                                            <span>{auth.user.name}</span>
                                            <ChevronDown size={16} />
                                        </button>
                                        
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg dark:bg-gray-800"
                                            >
                                                <Link
                                                    href="/dashboard"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    Profil
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center space-x-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <LogOut size={16} />
                                                    <span>Keluar</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <Link href={route('login')}>
                                            <motion.button
                                                className="px-4 py-2 text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Masuk
                                            </motion.button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <motion.button
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Daftar
                                            </motion.button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="flex items-center space-x-2 md:hidden">
                            <button onClick={toggleTheme} className="rounded-lg bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="rounded-lg bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            >
                                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="space-y-4 border-t border-gray-200 py-4 md:hidden dark:border-gray-700">
                            <a
                                href="#beranda"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('beranda');
                                }}
                                className="block cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Beranda
                            </a>
                            <a
                                href="#layanan"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('layanan');
                                }}
                                className="block cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Layanan
                            </a>
                            <a
                                href="#artikel"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('artikel');
                                }}
                                className="block cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Artikel
                            </a>
                            <a
                                href="#tentang"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('tentang');
                                }}
                                className="block cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Tentang
                            </a>
                            <a
                                href="#kontak"
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection('kontak');
                                }}
                                className="block cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            >
                                Kontak
                            </a>
                            
                            <div className="space-y-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                                {isAuthenticated ? (
                                    <>
                                        <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                                            <User size={20} />
                                            <span>{auth.user.name}</span>
                                        </div>
                                        <Link href="/dashboard">
                                            <motion.button
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Dashboard
                                            </motion.button>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                                        >
                                            <LogOut size={16} />
                                            <span>Keluar</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('login')}>
                                            <motion.button
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Masuk
                                            </motion.button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <motion.button
                                                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Daftar
                                            </motion.button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            
            {/* Hero Section */}
            <section
                id="beranda"
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-20 text-white lg:py-32 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900"
            >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <motion.div
                            className="space-y-8"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.5 }}
                            variants={containerVariants}
                        >
                            <div className="space-y-4">
                                <motion.h1 className="text-4xl leading-tight font-bold lg:text-6xl" variants={itemVariants}>
                                    Memahami
                                    <br />
                                    Keuangan dengan
                                    <br />
                                    <span className="text-yellow-400">Standar Terpercaya</span>
                                </motion.h1>
                                <motion.p className="text-xl leading-relaxed text-blue-100 lg:text-2xl" variants={itemVariants}>
                                    Di dunia yang terus berubah, pengelolahan keuangan yang tepat dan tranpsaran adalah kunci keberhasilan. PSAK hadir
                                    sebagai panduan utama bagi para profesional dan praktisi akuntansi di Indonesia, standar yang berlaku...
                                </motion.p>
                            </div>
                            <motion.div className="flex flex-col gap-4 sm:flex-row" variants={itemVariants}>
                                <motion.button
                                    onClick={() => scrollToSection('layanan')}
                                    className="flex items-center justify-center space-x-2 rounded-lg bg-yellow-500 px-8 py-4 text-lg font-semibold text-blue-900 transition-colors hover:bg-yellow-400"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>Mulai Sekarang</span>
                                    <ArrowRight size={20} />
                                </motion.button>
                                <motion.button
                                    onClick={showPSAKInfo}
                                    className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Pelajari Lebih Lanjut
                                </motion.button>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="relative"
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: false, amount: 0.5 }}
                            variants={heroImageVariants}
                        >
                            <div className="relative z-10 rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Dashboard PSAK</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                        <span className="font-medium text-blue-700 dark:text-blue-300">Laporan Keuangan</span>
                                        <span className="font-semibold text-green-600 dark:text-green-400">✓ Complete</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                                        <span className="font-medium text-yellow-700 dark:text-yellow-300">Audit Process</span>
                                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">⏳ In Progress</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Compliance Check</span>
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">📋 Pending</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-400 opacity-20"></div>
                            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-blue-300 opacity-20"></div>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section id="layanan" className="bg-white py-20 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2
                            className="mb-4 text-3xl font-bold text-black lg:text-4xl dark:text-white"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            Mengapa PSAK 109?
                        </motion.h2>
                        <motion.p
                            className="text-xl text-black dark:text-gray-300"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Solusi lengkap untuk kebutuhan akuntansi dan pelaporan keuangan Anda
                        </motion.p>
                    </div>
                    <motion.div
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.5 }}
                        variants={containerVariants}
                    >
                        {[
                            {
                                icon: <Shield className="h-12 w-12 text-blue-600" />,
                                title: 'Transparansi',
                                description:
                                    'Standar yang diakui secara nasional dan dirancang untuk memastikan konsistensi dan kejelasan dalam pelaporan keuangan.',
                            },
                            {
                                icon: <DollarSign className="h-12 w-12 text-green-600" />,
                                title: 'Akurasi dan Keandalan',
                                description:
                                    'PSAK memberikan panduan yang jelas dan rinci, sehingga setiap laporan keuangan yang dihasilkan dapat dipercaya dan dipahami oleh semua pihak yang berkepentingan.',
                            },
                            {
                                icon: <Globe className="h-12 w-12 text-purple-600" />,
                                title: 'Mudah Online',
                                description:
                                    'Semua dokumen dan sumber daya PSAK tersedia dalam satu platform yang mudah diakses kapan saja dan di mana saja, mendukung kebutuhan profesional Anda secara real-time.',
                            },
                            {
                                icon: <Headphones className="h-12 w-12 text-orange-600" />,
                                title: 'Dukungan Terdepan',
                                description:
                                    'PSAK selalu diperbarui dengan perkembangan terbaru dalam dunia akuntansi dan regulasi keuangan, memastikan Anda selalu selangkah lebih maju',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-900"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="mb-6">{feature.icon}</div>
                                <h3 className="mb-4 text-xl font-bold text-black dark:text-white">{feature.title}</h3>
                                <p className="leading-relaxed text-black dark:text-gray-300">{feature.description}</p>
                                <button
                                    onClick={() => showServiceDetail(feature.title)}
                                    className="mt-6 flex items-center space-x-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <span>Pelajari Lebih Lanjut</span>
                                    <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            
            {/* Artikel Section */}
            <section id="artikel" className="bg-gray-50 py-20 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2
                            className="mb-4 text-3xl font-bold text-black lg:text-4xl dark:text-white"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            Artikel
                        </motion.h2>
                        <motion.p
                            className="text-xl text-black dark:text-gray-300"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Informasi PSAK Instrumen Keuangan
                        </motion.p>
                    </div>
                    <motion.div
                        className="grid gap-8 md:grid-cols-2"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.5 }}
                        variants={containerVariants}
                    >
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900"
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                {/* Gambar dengan tampilan yang lebih baik */}
                                <div className="relative h-80 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute right-4 bottom-4 left-4">
                                        <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar size={14} className="mr-1" />
                                        <span>{article.date}</span>
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-black dark:text-white">{article.title}</h3>
                                    <p className="mb-4 text-gray-600 dark:text-gray-300">{article.excerpt}</p>
                                    <button
                                        onClick={() => showArticleDetail(article)}
                                        className="flex items-center space-x-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <span>Lihat Selengkapnya</span>
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            
            {/* About Section */}
            <section id="tentang" className="bg-white py-20 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <motion.h2
                            className="mb-4 text-3xl font-bold text-black lg:text-4xl dark:text-white"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            Beberapa Pertanyaan Penting
                        </motion.h2>
                        <motion.p
                            className="text-xl text-black dark:text-gray-300"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Pertanyaan yang Sering Diajukan
                        </motion.p>
                    </div>
                    <motion.div
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.div className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800" variants={itemVariants}>
                            <div className="mb-4 flex items-center">
                                <HelpCircle className="mr-3 h-8 w-8 text-blue-600" />
                                <h3 className="text-xl font-bold text-black dark:text-white">Apa itu PSAK?</h3>
                            </div>
                            <p className="text-black dark:text-gray-300">
                                Jawaban: PSAK (Pernyataan Standar Akuntansi Keuangan) adalah standar yang ditetapkan oleh Ikatan Akuntan Indonesia
                                (IAI) yang mengatur bagaimana laporan keuangan harus disusun dan disajikan di Indonesia. PSak dirancang untuk
                                memastikan transparansi, konsistensi, dan akurasi dalam pelaporan keuangan.
                            </p>
                        </motion.div>
                        <motion.div className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800" variants={itemVariants}>
                            <div className="mb-4 flex items-center">
                                <Star className="mr-3 h-8 w-8 text-yellow-500" />
                                <h3 className="text-xl font-bold text-black dark:text-white">Mengapa PSAK penting?</h3>
                            </div>
                            <p className="text-black dark:text-gray-300">
                                Jawaban: PSAK penting karena memastikan bahwa laporan keuangan yang dibuat oleh perusahaan di Indonesia mengikuti
                                standar yang diakui secara nasional. Ini membantu dalam meningkatkan kepercayaan pemangku kepentingan, seperti
                                investor, kreditur, dan pihak berwenang, terhadap informasi keuangan yang disajikan.
                            </p>
                        </motion.div>
                        <motion.div className="rounded-xl bg-gray-50 p-8 shadow-lg dark:bg-gray-800" variants={itemVariants}>
                            <div className="mb-4 flex items-center">
                                <Users className="mr-3 h-8 w-8 text-green-600" />
                                <h3 className="text-xl font-bold text-black dark:text-white">Siapa yang harus mematuhi PSAK</h3>
                            </div>
                            <p className="text-black dark:text-gray-300">
                                Jawaban: PSAK berlaku untuk semua entitas yang beroperasi di Indonesia, termasuk perusahaan publik dan swasta, lembaga
                                non-profit, serta entitas pemerintah. Setiap entitas yang diwajibkan untuk menyusun laporan keuangan harus mematuhi
                                PSak.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* Stats Section */}
            <section className="bg-blue-600 py-20 text-white dark:bg-blue-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid gap-8 text-center md:grid-cols-3"
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <div className="mb-2 flex items-center justify-center">
                                <Building className="mr-2 h-8 w-8" />
                                <div className="text-4xl font-bold lg:text-5xl">1000+</div>
                            </div>
                            <div className="text-xl text-blue-100">Perusahaan Terdaftar</div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <div className="mb-2 flex items-center justify-center">
                                <CheckCircle className="mr-2 h-8 w-8" />
                                <div className="text-4xl font-bold lg:text-5xl">99.9%</div>
                            </div>
                            <div className="text-xl text-blue-100">Tingkat Akurasi</div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <div className="mb-2 flex items-center justify-center">
                                <Headphones className="mr-2 h-8 w-8" />
                                <div className="text-4xl font-bold lg:text-5xl">24/7</div>
                            </div>
                            <div className="text-xl text-blue-100">Support Available</div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            
            {/* Contact Section dengan Peta */}
            <section id="kontak" className="bg-white py-16 text-black dark:bg-black dark:text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <motion.h2
                            className="mb-4 text-3xl font-bold text-black dark:text-white"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            Hubungi Kami
                        </motion.h2>
                        <motion.p
                            className="text-xl text-black dark:text-gray-300"
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Kunjungi kantor pusat kami atau hubungi kami untuk informasi lebih lanjut
                        </motion.p>
                    </div>
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Peta Lokasi */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.7 }}
                            className="h-96 overflow-hidden rounded-2xl shadow-lg"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7932.687818531351!2d106.8315761!3d-6.2182988!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f352e1886cff%3A0x14234709c5055ac2!2svOffice%20-%20Menara%20Kuningan%20(Virtual%20Office%20%7C%20Serviced%20Office%20%7C%20Meeting%20Room)!5e0!3m2!1sid!2sid!4v1755966510584!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Lokasi Kantor Pusat PSAK 109"
                            ></iframe>
                        </motion.div>
                        {/* Informasi Kontak */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.7 }}
                            className="space-y-8"
                        >
                            <div>
                                <h3 className="mb-6 text-2xl font-bold text-black dark:text-white">Kantor Pusat</h3>
                                <div className="space-y-4 text-black dark:text-gray-300">
                                    <div className="flex items-start space-x-3">
                                        <MapPin size={20} className="mt-1 text-blue-400" />
                                        <div>
                                            <p className="font-medium">
                                                Jl. H. Rasuna Said Kav. 5 Blok X-7 RT/RW. 006/007 Kel, Karet Kuningan, Kec. Setiabudi, Daerah Khusus
                                                Ibukota Jakarta 12940
                                            </p>
                                            <p className="text-sm">vOffice - Menara Kuningan (Virtual Office | Serviced Office | Meeting Room)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Phone size={20} className="mt-1 text-blue-400" />
                                        <div>
                                            <p className="font-medium">+62 856 1512 634</p>
                                            <p className="text-sm">Senin - Jumat, 09:00 - 18:00</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Mail size={20} className="mt-1 text-blue-400" />
                                        <div>
                                            <p className="font-medium">riyadi@pramatech.id</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Layanan</h3>
                                <ul className="space-y-3 text-black dark:text-gray-300">
                                    <li className="flex items-center">
                                        <FileCheck className="mr-3 h-5 w-5 text-blue-400" />
                                        <span>Pelaporan Keuangan</span>
                                    </li>
                                    <li className="flex items-center">
                                        <BarChart3 className="mr-3 h-5 w-5 text-blue-400" />
                                        <span>Audit & Compliance</span>
                                    </li>
                                    <li className="flex items-center">
                                        <MessageSquare className="mr-3 h-5 w-5 text-blue-400" />
                                        <span>Konsultasi</span>
                                    </li>
                                    <li className="flex items-center">
                                        <UserCheck className="mr-3 h-5 w-5 text-blue-400" />
                                        <span>Training</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex space-x-4">
                                <motion.button
                                    className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Phone size={16} />
                                    <a href="https://api.whatsapp.com/send/?phone=628561512634&text&type=phone_number&app_absent=0" target="blank">
                                        <span>Hubungi Kami</span>
                                    </a>
                                </motion.button>
                                <motion.button
                                    className="flex items-center space-x-2 rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Mail size={16} />
                                    <a href="https://mail.google.com/mail/u/0/?fs=1&to=riyadi@pramatech.id&tf=cm" target="blank">
                                        <span>Email</span>
                                    </a>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-16 border-t border-gray-300 pt-8 dark:border-gray-800">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <div className="mb-6 flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                        <img
                                            src="https://images.glints.com/unsafe/glints-dashboard.oss-ap-southeast-1.aliyuncs.com/company-logo/d220ce67a030b660bb79789bee54dc33.jpg"
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black dark:text-white">PSAK 109</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Instrumen Keuangan</p>
                                    </div>
                                </div>
                                <p className="mb-6 leading-relaxed text-black dark:text-gray-300">
                                    Bergabunglah dengan kami dan jadilah bagian dari komunitas kami di sosial media. Kami senang dapat berbagi
                                    informasi dan berdiskusi dengan Anda!
                                </p>
                                <div className="flex space-x-4">
                                    <motion.button
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <a href="https://www.facebook.com/p/PT-Pramatech-Adimitra-Solusi-100069237698540/?_rdr" target="blank">
                                            <Facebook size={20} />
                                        </a>
                                    </motion.button>
                                    <motion.button
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 transition-colors hover:bg-blue-500"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Twitter size={20} />
                                    </motion.button>
                                    <motion.button
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 transition-colors hover:bg-blue-800"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <a href="https://www.linkedin.com/company/pt-pramatech-adimitra-solusi/" target="blank">
                                            <Linkedin size={20} />
                                        </a>
                                    </motion.button>
                                    <motion.button
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 transition-colors hover:bg-pink-700"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <a href="https://www.instagram.com/pramatech.id/#" target="blank">
                                            <Instagram size={20} />
                                        </a>
                                    </motion.button>
                                </div>
                            </div>
                            <div>
                                <h4 className="mb-6 text-lg font-bold text-black dark:text-white">Tautan Cepat</h4>
                                <ul className="space-y-3 text-black dark:text-gray-300">
                                    <li className="flex items-center">
                                        <ChevronRight className="mr-2 h-4 w-4" />
                                        <a
                                            href="#beranda"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection('beranda');
                                            }}
                                            className="transition-colors hover:text-blue-600 dark:hover:text-white"
                                        >
                                            Beranda
                                        </a>
                                    </li>
                                    <li className="flex items-center">
                                        <ChevronRight className="mr-2 h-4 w-4" />
                                        <a
                                            href="#layanan"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection('layanan');
                                            }}
                                            className="transition-colors hover:text-blue-600 dark:hover:text-white"
                                        >
                                            Layanan
                                        </a>
                                    </li>
                                    <li className="flex items-center">
                                        <ChevronRight className="mr-2 h-4 w-4" />
                                        <a
                                            href="#artikel"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection('artikel');
                                            }}
                                            className="transition-colors hover:text-blue-600 dark:hover:text-white"
                                        >
                                            Artikel
                                        </a>
                                    </li>
                                    <li className="flex items-center">
                                        <ChevronRight className="mr-2 h-4 w-4" />
                                        <a
                                            href="#tentang"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection('tentang');
                                            }}
                                            className="transition-colors hover:text-blue-600 dark:hover:text-white"
                                        >
                                            Tentang
                                        </a>
                                    </li>
                                    <li className="flex items-center">
                                        <ChevronRight className="mr-2 h-4 w-4" />
                                        <a
                                            href="#kontak"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollToSection('kontak');
                                            }}
                                            className="transition-colors hover:text-blue-600 dark:hover:text-white"
                                        >
                                            Kontak
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-6 text-lg font-bold text-black dark:text-white">Newsletter</h4>
                                <p className="mb-4 text-black dark:text-gray-300">Daftar untuk mendapatkan update terbaru dari kami</p>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Email Anda"
                                        className="w-full rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-black focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                    <motion.button
                                        className="rounded-r-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Daftar
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 text-center text-black dark:text-gray-400">
                            <p>&copy; 2024 PSAK 109. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Custom CSS untuk artikel */}
            <style jsx global>{`
                .article-content h3 {
                    text-align: center;
                    font-weight: bold;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                }
                .article-content h4 {
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }
                .article-content p {
                    margin-bottom: 1rem;
                }
                .article-content ul {
                    list-style-type: square;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                    text-align: left;
                }
                .article-content ul li {
                    margin-bottom: 0.5rem;
                }
                .article-content a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                .article-content a:hover {
                    color: #1d4ed8;
                }
                .dark .article-content a {
                    color: #60a5fa;
                }
                .dark .article-content a:hover {
                    color: #93c5fd;
                }
            `}</style>
        </div>
    );
}