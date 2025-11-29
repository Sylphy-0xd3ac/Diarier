import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, List, Typography, DatePicker, message, Tooltip, Modal } from 'antd';
import dayjs from 'dayjs';
import ReactMarkdown from 'react-markdown';
import { moloService } from '../services/moloService';
import { Diary } from '../types';
import { FileTextIcon, LogoIcon, PlusIcon, SaveIcon, SearchIcon, MoonIcon, SunIcon } from './Icons';
import { v4 as uuidv4 } from 'uuid';

const { Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  diaryId: string | null;
}

interface DashboardProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ darkMode, toggleTheme }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [filteredDiaries, setFilteredDiaries] = useState<Diary[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Editor/View State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState<dayjs.Dayjs>(dayjs());
  const [editContent, setEditContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    diaryId: null,
  });

  // Fetch diaries (silent mode optional for background refresh)
  const fetchDiaries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await moloService.getDiaries();
      if (res.success && res.data) {
        setDiaries(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch diaries", error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  // Filter Logic
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredDiaries(diaries);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredDiaries(diaries.filter(d => 
        d.title.toLowerCase().includes(lower) || 
        d.content.toLowerCase().includes(lower)
      ));
    }
  }, [searchText, diaries]);

  // Close context menu on global click
  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Handle diary selection (Left Click - Read Only)
  const handleSelectDiary = (diary: Diary) => {
    if (isDirty && isEditing) {
      confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Discard them?',
        onOk() {
            setSelectedId(diary.id);
            setEditTitle(diary.title);
            setEditDate(dayjs(diary.date));
            setEditContent(diary.content);
            setIsEditing(false);
            setIsDirty(false);
        },
      });
      return;
    }
    
    setSelectedId(diary.id);
    setEditTitle(diary.title);
    setEditDate(dayjs(diary.date));
    setEditContent(diary.content);
    setIsEditing(false); // Default to read-only
    setIsDirty(false);
  };

  // Handle Right Click on Diary Item
  const handleContextMenu = (e: React.MouseEvent, diaryId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling
    console.log('[Dashboard] Opening context menu for:', diaryId);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      diaryId,
    });
  };

  const performDelete = async (id: string) => {
    console.log(`[Dashboard] Executing performDelete for ${id}`);
    try {
      // Optimistic Update: Immediately remove from UI
      setDiaries(currentDiaries => currentDiaries.filter(d => d.id !== id));

      // If the deleted item was currently selected, clear the editor
      if (selectedId === id) {
        setSelectedId(null);
        setEditTitle('');
        setEditContent('');
        setIsEditing(false);
      }

      // Call the service to delete from storage
      const res = await moloService.deleteDiary(id);
      
      if (res.success) {
        message.success("Deleted");
        // RELOAD LIST from service strictly, but silently
        await fetchDiaries(true);
      } else {
        message.error("Failed to delete");
        // Revert optimistic update by full reload
        await fetchDiaries(false); 
      }
    } catch (error) {
      console.error("Delete error", error);
      message.error("An error occurred");
      await fetchDiaries(false);
    }
  };

  const handleDelete = (id: string) => {
    console.log('[Dashboard] handleDelete triggered for:', id);
    // Close menu immediately
    setContextMenu(prev => ({ ...prev, visible: false }));

    confirm({
      title: 'Delete Diary',
      content: 'Are you sure you want to delete this diary?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        performDelete(id);
      },
    });
  };

  const handleEditFromMenu = (id: string) => {
    const diary = diaries.find(d => d.id === id);
    if (diary) {
      handleSelectDiary(diary);
      setIsEditing(true); // Switch to edit mode
    }
  };

  // Create new diary
  const handleCreateNew = () => {
    if (isDirty && isEditing) {
       confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Discard them?',
        onOk() {
            startNewDiary();
        },
      });
      return;
    }
    startNewDiary();
  };

  const startNewDiary = () => {
    const newId = uuidv4();
    setSelectedId(newId);
    setEditTitle('');
    setEditDate(dayjs());
    setEditContent('');
    setIsEditing(true); // New diary starts in edit mode
    setIsDirty(true); 
  };

  // Enhanced Markdown Auto-complete logic
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pairs: Record<string, string> = {
      '(': ')',
      '{': '}',
      '[': ']',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = editContent;

    if (pairs[e.key]) {
      e.preventDefault();
      const newValue = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
      setEditContent(newValue);
      setIsDirty(true);
      // Move cursor to middle
      setTimeout(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1;
      }, 0);
    } 
    // Bold/Italic auto-pair for * (only if user types it, standard markdown behavior)
    else if (e.key === '*') {
      // Check if we are already inside stars or if user selected text to bold
      // Simple auto-pair for now
      e.preventDefault();
      const newValue = value.substring(0, start) + '**' + value.substring(end);
      setEditContent(newValue);
      setIsDirty(true);
      setTimeout(() => {
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      message.warning('Please enter a title');
      return;
    }
    if (!selectedId) return;

    const diaryToSave: Diary = {
      id: selectedId,
      title: editTitle,
      date: editDate.toISOString(),
      content: editContent,
      createdAt: Date.now(), 
      updatedAt: Date.now()
    };

    const res = await moloService.saveDiary(diaryToSave);
    if (res.success) {
      message.success('Saved');
      setIsDirty(false);
      setIsEditing(false); // Switch back to view mode after save
      fetchDiaries(true); // Refresh list
    } else {
      message.error('Failed to save');
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-black dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-80 border-r border-black dark:border-gray-800 flex flex-col p-6 gap-6 bg-white dark:bg-black shrink-0 rounded-r-3xl z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-8 h-8 text-black dark:text-white" />
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Molo</h1>
          </div>
          <Button 
            type="text" 
            shape="circle" 
            icon={darkMode ? <SunIcon className="w-5 h-5 text-white" /> : <MoonIcon className="w-5 h-5" />} 
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            type="primary" 
            icon={<PlusIcon className="w-4 h-4" />} 
            size="large"
            className="w-full flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:!bg-gray-800 dark:hover:!bg-gray-200 rounded-lg h-12 shadow-none border-none"
            onClick={handleCreateNew}
          >
            New Diary
          </Button>
          
          <Input 
            prefix={<SearchIcon className="w-4 h-4 text-gray-400" />}
            placeholder="Search diaries..." 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="rounded-lg bg-gray-50 dark:bg-gray-900 border-none shadow-none text-sm dark:text-white dark:placeholder:text-gray-600"
            allowClear
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <List<Diary>
            rowKey="id"
            loading={loading}
            dataSource={filteredDiaries}
            split={false}
            locale={{ emptyText: <div className="mt-10 text-gray-400 dark:text-gray-600 text-sm text-center">No diaries found.</div> }}
            renderItem={(item) => (
              <div 
                onClick={() => handleSelectDiary(item)}
                onContextMenu={(e) => handleContextMenu(e, item.id)}
                className={`
                  group mb-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border flex justify-between items-center select-none
                  ${selectedId === item.id 
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' 
                    : 'bg-white dark:bg-gray-900 text-black dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white'
                  }
                `}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-semibold text-lg mb-1 truncate">{item.title || 'Untitled'}</div>
                  <div className={`text-xs ${selectedId === item.id ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {dayjs(item.date).format('MMM D, YYYY')}
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950 relative transition-colors duration-300">
        {selectedId ? (
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-12 animate-in fade-in duration-500">
            
            <div className="flex flex-col gap-6 mb-8 border-b pb-6 border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <Text className="text-gray-400 dark:text-gray-500 uppercase tracking-widest text-xs font-bold">
                  {isEditing ? 'Compose your diary' : 'Reading Mode'}
                </Text>
              </div>

              {/* Metadata Display / Inputs - Side by Side Layout */}
              <div className="flex flex-row items-center gap-4">
                 {isEditing ? (
                   <>
                     <Input 
                        placeholder="Title" 
                        value={editTitle}
                        onChange={(e) => {
                          setEditTitle(e.target.value);
                          setIsDirty(true);
                        }}
                        className="flex-1 text-3xl font-bold border-none shadow-none focus:shadow-none p-0 bg-transparent transition-colors placeholder:text-gray-200 dark:placeholder:text-gray-700 text-black dark:text-white"
                      />
                      <DatePicker 
                        value={editDate}
                        onChange={(date) => {
                           if (date) {
                             setEditDate(date);
                             setIsDirty(true);
                           }
                        }}
                        format="MMM D, YYYY"
                        className="w-40 border border-black dark:border-white rounded-xl shadow-none hover:border-black dark:hover:border-white focus:border-black dark:focus:border-white bg-transparent dark:bg-gray-900 text-black dark:text-white"
                        suffixIcon={null}
                        allowClear={false}
                      />
                   </>
                 ) : (
                   <>
                    <h1 className="flex-1 text-4xl font-bold text-black dark:text-white truncate pr-4">{editTitle || 'Untitled'}</h1>
                    <div className="shrink-0 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium border border-gray-100 dark:border-gray-800 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                      {editDate.format('MMMM DD, YYYY')}
                    </div>
                   </>
                 )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-y-auto custom-scrollbar">
              {isEditing ? (
                <TextArea 
                  value={editContent}
                  onChange={(e) => {
                    setEditContent(e.target.value);
                    setIsDirty(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Start writing... (Markdown supported)"
                  className="w-full h-full resize-none text-lg leading-relaxed border-none focus:shadow-none p-0 bg-transparent focus:ring-0 placeholder:text-gray-200 dark:placeholder:text-gray-700 text-black dark:text-gray-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  spellCheck={false}
                />
              ) : (
                <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none text-black dark:text-gray-200">
                  <ReactMarkdown>{editContent || '*No content*'}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Floating Action Button (Only in Edit Mode) */}
            {isEditing && (
              <div className="absolute bottom-10 right-10">
                <Tooltip title="Save Diary">
                  <Button 
                    type="primary"
                    shape="circle"
                    size="large"
                    onClick={handleSave}
                    className={`
                      w-16 h-16 flex items-center justify-center shadow-2xl border-none transition-all duration-300 bg-black dark:bg-white text-white dark:text-black hover:!bg-gray-800 dark:hover:!bg-gray-200
                    `}
                  >
                    <SaveIcon className="w-6 h-6" />
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-700">
            <FileTextIcon className="w-24 h-24 mb-4 opacity-20" />
            <Text className="text-gray-400 dark:text-gray-600 text-lg">Select a diary to view or create a new one.</Text>
          </div>
        )}
      </div>

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div 
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg py-1 w-40 overflow-hidden animate-in fade-in duration-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()} 
        >
          <div 
            className="px-4 py-3 hover:bg-black hover:text-white dark:text-gray-200 dark:hover:bg-white dark:hover:text-black cursor-pointer text-sm font-medium transition-colors"
            onClick={() => {
              if (contextMenu.diaryId) handleEditFromMenu(contextMenu.diaryId);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
          >
            Change (Edit)
          </div>
          <div 
            className="px-4 py-3 hover:bg-red-600 hover:text-white dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer text-sm font-medium transition-colors border-t border-gray-100 dark:border-gray-700"
            onClick={(e) => {
               e.stopPropagation();
               console.log("Delete clicked in menu, ID:", contextMenu.diaryId);
               if (contextMenu.diaryId) handleDelete(contextMenu.diaryId);
            }}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  );
};