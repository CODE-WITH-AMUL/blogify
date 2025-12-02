import { 
  Cpu, Code, Terminal, Zap, PenTool, Layout, Globe, Database, 
  Server, Disc, Brackets, Anchor, Aperture, Heart, TrendingUp, 
  BookOpen, Smartphone, Coffee, Layers, Cloud, GitBranch,
  Shield, Monitor, DatabaseZap, FileCode, TerminalSquare
} from 'lucide-react';

export const getCategoryIcon = (category) => {
  if (!category) return <BookOpen size={20} />;
  
  const categoryName = typeof category === 'string' ? category.toUpperCase() : '';
  
  const iconMap = {
    'TECHNOLOGY': <Cpu size={20} />,
    'CODING': <Code size={20} />,
    'PROGRAMMING': <Terminal size={20} />,
    'JAVASCRIPT': <Code size={20} />,
    'PYTHON': <TerminalSquare size={20} />,
    'REACT': <Zap size={20} />,
    'CSS': <PenTool size={20} />,
    'HTML': <Layout size={20} />,
    'DJANGO': <Globe size={20} />,
    'NODEJS': <Database size={20} />,
    'SQL': <Database size={20} />,
    'MONGODB': <Server size={20} />,
    'POSTGRESQL': <Disc size={20} />,
    'JAVA': <Coffee size={20} />,
    'CPLUSPLUS': <Brackets size={20} />,
    'GO': <Anchor size={20} />,
    'CSHARP': <FileCode size={20} />,
    'ANGULAR': <Aperture size={20} />,
    'VUE': <Heart size={20} />,
    'FLASK': <TrendingUp size={20} />,
    'TYPESCRIPT': <BookOpen size={20} />,
    'PHP': <Globe size={20} />,
    'MOBILE': <Smartphone size={20} />,
    'DATABASE': <DatabaseZap size={20} />,
    'BACKEND': <Server size={20} />,
    'FRONTEND': <Monitor size={20} />,
    'DEVOPS': <GitBranch size={20} />,
    'CLOUD': <Cloud size={20} />,
    'SECURITY': <Shield size={20} />,
    'GENERAL': <BookOpen size={20} />,
    'TUTORIAL': <Layers size={20} />,
    'API': <GitBranch size={20} />,
    'WEB DEV': <Globe size={20} />,
    'STATE MANAGEMENT': <Layers size={20} />,
    'SCALABILITY': <TrendingUp size={20} />,
    'WEB DESIGN': <PenTool size={20} />
  };
  
  return iconMap[categoryName] || <BookOpen size={20} />;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Recent';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If within 7 days, show relative time
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return 'Recent';
  }
};

export const calculateReadTime = (content) => {
  if (!content) return '5 min read';
  
  try {
    // Remove HTML tags if present
    const textOnly = content.replace(/<[^>]*>/g, '');
    const words = textOnly.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  } catch {
    return '5 min read';
  }
};

// Helper to extract tags from post
export const extractTags = (post) => {
  if (!post) return [];
  
  if (Array.isArray(post.tag)) {
    return post.tag.filter(tag => tag && typeof tag === 'string');
  }
  
  if (typeof post.tag === 'string') {
    return post.tag.split(',').map(t => t.trim()).filter(Boolean);
  }
  
  return [];
};

// Helper to get category name
export const getCategoryName = (post) => {
  if (!post) return 'Uncategorized';
  
  if (post.category) {
    if (typeof post.category === 'object') {
      return post.category.Category || post.category.name || 'Uncategorized';
    }
    return post.category;
  }
  
  return 'Uncategorized';
};