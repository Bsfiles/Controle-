
import React, { useState, useCallback, useRef } from 'react';
import Card from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadIcon, FileIcon, TrashIcon } from '../components/icons/Icons';
import { XIcon } from '../components/icons/Icons';

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    file?: File;
    month: string;
    year: number;
}

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'entradas' | 'saidas' | 'outros'>('entradas');
    const [files, setFiles] = useState<{[key: string]: UploadedFile[]}>({
        entradas: [],
        saidas: [],
        outros: [],
    });
    const [dragActive, setDragActive] = useState(false);
    const [viewModal, setViewModal] = useState<{ open: boolean; src?: string; name?: string }>({ open: false });
    const [selectedMonth, setSelectedMonth] = useState('Outubro');
    const [selectedYear, setSelectedYear] = useState(2025);
    const [filterMonthYear, setFilterMonthYear] = useState<string>('Todos');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (newFiles: FileList) => {
        const uploadedFiles = Array.from(newFiles).map(file => ({ name: file.name, size: file.size, type: file.type, file, month: selectedMonth, year: selectedYear }));
        setFiles(prev => ({
            ...prev,
            [activeTab]: [...prev[activeTab], ...uploadedFiles]
        }));
        // Aqui você normalmente lidaria com o upload para um servidor
    };

    const handleView = useCallback((file: UploadedFile) => {
        if (file.file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setViewModal({ open: true, src: e.target?.result as string, name: file.name });
                };
                reader.readAsDataURL(file.file);
            } else if (file.type === 'application/pdf') {
                const url = URL.createObjectURL(file.file);
                window.open(url, '_blank');
            }
        } else {
            alert('Arquivo não disponível para visualização.');
        }
    }, []);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleDelete = useCallback((fileName: string) => {
        setFiles(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(f => f.name !== fileName)
        }));
    }, [activeTab]);

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Configurações</h2>
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Gestão de Comprovantes</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Anexe e gerencie os comprovantes de suas transações. Formatos aceitos: PDF, JPG, PNG.
                </p>

                <div className="flex space-x-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Mês</label>
                        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="px-3 py-2 border rounded-md bg-white dark:bg-surface dark:border-border-dark">
                            <option value="Janeiro">Janeiro</option>
                            <option value="Fevereiro">Fevereiro</option>
                            <option value="Março">Março</option>
                            <option value="Abril">Abril</option>
                            <option value="Maio">Maio</option>
                            <option value="Junho">Junho</option>
                            <option value="Julho">Julho</option>
                            <option value="Agosto">Agosto</option>
                            <option value="Setembro">Setembro</option>
                            <option value="Outubro">Outubro</option>
                            <option value="Novembro">Novembro</option>
                            <option value="Dezembro">Dezembro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Ano</label>
                        <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))} className="px-3 py-2 border rounded-md bg-white dark:bg-surface dark:border-border-dark">
                            {Array.from({ length: 10 }, (_, i) => 2025 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="relative">
                    <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-border-dark hover:border-gray-500"}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold text-primary">Clique para carregar</span> ou arraste e solte
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, PNG (MAX. 10MB)</p>
                        </div>
                        <input
                            ref={inputRef}
                            id="file-upload"
                            type="file"
                            className="hidden"
                            multiple={true}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                    </label>
                </form>

                <div className="mt-8">
                    <div className="flex space-x-1 mb-4">
                        <Button variant={activeTab === 'entradas' ? 'primary' : 'secondary'} onClick={() => setActiveTab('entradas')}>Entradas</Button>
                        <Button variant={activeTab === 'saidas' ? 'primary' : 'secondary'} onClick={() => setActiveTab('saidas')}>Saídas</Button>
                        <Button variant={activeTab === 'outros' ? 'primary' : 'secondary'} onClick={() => setActiveTab('outros')}>Outros</Button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                            <select value={filterMonthYear} onChange={e => setFilterMonthYear(e.target.value)} className="px-3 py-2 border rounded-md bg-white dark:bg-surface dark:border-border-dark">
                                <option value="Todos">Todos</option>
                                {Array.from(new Set(files[activeTab].map(f => `${f.month} ${f.year}`))).sort().map(my => (
                                    <option key={my} value={my}>{my}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {Object.keys(files[activeTab].reduce((acc, file) => {
                            const monthYear = `${file.month} ${file.year}`;
                            if (!acc[monthYear]) acc[monthYear] = [];
                            acc[monthYear].push(file);
                            return acc;
                        }, {} as {[key: string]: UploadedFile[]})).filter(monthYear => filterMonthYear === 'Todos' || monthYear === filterMonthYear).sort((a, b) => b.localeCompare(a)).map(monthYear => (
                            <div key={monthYear}>
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{monthYear}</h5>
                                <ul className="space-y-2 ml-4">
                                    {files[activeTab].filter(file => `${file.month} ${file.year}` === monthYear).sort((a, b) => a.name.localeCompare(b.name)).map((file, index) => (
                                        <li key={index} className="bg-dark p-3 rounded-lg flex items-center justify-between border border-border-dark">
                                            <div className="flex items-center truncate min-w-0">
                                                <FileIcon className="w-6 h-6 text-primary flex-shrink-0 mr-3" />
                                                <div className="truncate">
                                                    <span className="text-sm font-medium text-text-main-dark truncate block">{file.name}</span>
                                                    <span className="text-xs text-text-secondary-dark">{formatBytes(file.size)}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 flex-shrink-0 ml-4">
                                                <button onClick={() => handleView(file)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full">
                                                    👁️
                                                </button>
                                                <button onClick={() => handleDelete(file.name)} className="text-gray-400 hover:text-red-500 p-1 rounded-full">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        {files[activeTab].length === 0 && (
                            <div className="text-center py-8 border border-dashed border-border-dark rounded-lg">
                                <FileIcon className="mx-auto h-10 w-10 text-gray-500" />
                                <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">Nenhum comprovante anexado nesta categoria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {viewModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b dark:border-border-dark">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{viewModal.name}</h3>
                            <button onClick={() => setViewModal({ open: false })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 flex justify-center">
                            {viewModal.src && <img src={viewModal.src} alt={viewModal.name} className="max-w-full max-h-96 object-contain" />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
