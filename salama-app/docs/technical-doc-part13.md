# SALAMA Technical Documentation - Part 13

## 24. Development Environment

### 24.1 Development Tools Setup
```python
# Development Environment Configuration
from dataclasses import dataclass
from typing import Dict, List, Optional
import yaml
import subprocess

@dataclass
class DevEnvironment:
    """Development environment configuration."""
    
    python_version: str = "3.11"
    cuda_version: str = "12.1"
    node_version: str = "18.x"
    docker_compose_version: str = "2.20.0"
    
    def setup(self):
        """Set up development environment."""
        try:
            # Create virtual environment
            self._create_venv()
            
            # Install dependencies
            self._install_dependencies()
            
            # Setup GPU support
            self._setup_gpu()
            
            # Configure development tools
            self._setup_dev_tools()
            
        except Exception as e:
            logger.error(f"Environment setup error: {e}")
            raise

class DevelopmentTools:
    """Development tools management."""
    
    def __init__(self):
        self.config = self._load_config()
        
    def setup_tools(self):
        """Setup development tools."""
        # Install VSCode extensions
        self._install_vscode_extensions([
            "ms-python.python",
            "ms-python.vscode-pylance",
            "ms-toolsai.jupyter",
            "dbaeumer.vscode-eslint",
            "esbenp.prettier-vscode"
        ])
        
        # Configure Git hooks
        self._setup_git_hooks()
        
        # Setup debugging tools
        self._setup_debugger()
        
    def _setup_git_hooks(self):
        """Configure Git hooks for development."""
        hooks = {
            "pre-commit": [
                "black .",
                "flake8",
                "mypy .",
                "pytest"
            ],
            "pre-push": [
                "pytest -v"
            ]
        }
        
        for hook_name, commands in hooks.items():
            self._create_git_hook(hook_name, commands)
```

### 24.2 Utility Functions
```python
# Common Utility Functions
class SALAMAUtils:
    """Common utility functions for SALAMA."""
    
    @staticmethod
    def format_timestamp(
        timestamp: datetime,
        format: str = "ISO"
    ) -> str:
        """Format timestamp in specified format."""
        formats = {
            "ISO": "%Y-%m-%dT%H:%M:%S.%fZ",
            "human": "%Y-%m-%d %H:%M:%S",
            "date": "%Y-%m-%d",
            "time": "%H:%M:%S"
        }
        return timestamp.strftime(formats.get(format, formats["ISO"]))
    
    @staticmethod
    def validate_frame(
        frame: np.ndarray
    ) -> bool:
        """Validate video frame."""
        if frame is None:
            return False
        if not isinstance(frame, np.ndarray):
            return False
        if len(frame.shape) != 3:
            return False
        if frame.shape[2] not in [3, 4]:
            return False
        return True
    
    @staticmethod
    async def ensure_gpu_memory(
        required_memory: int
    ) -> bool:
        """Ensure sufficient GPU memory."""
        try:
            gpu_info = await get_gpu_info()
            available_memory = gpu_info['free_memory']
            return available_memory >= required_memory
        except Exception:
            return False

class ImageUtils:
    """Image processing utilities."""
    
    @staticmethod
    def resize_frame(
        frame: np.ndarray,
        target_size: Tuple[int, int]
    ) -> np.ndarray:
        """Resize frame while maintaining aspect ratio."""
        height, width = frame.shape[:2]
        
        # Calculate target dimensions
        target_width, target_height = target_size
        aspect = width / height
        
        if width > height:
            new_width = target_width
            new_height = int(new_width / aspect)
        else:
            new_height = target_height
            new_width = int(new_height * aspect)
            
        return cv2.resize(frame, (new_width, new_height))
    
    @staticmethod
    def normalize_frame(
        frame: np.ndarray
    ) -> np.ndarray:
        """Normalize frame for model input."""
        # Convert to float32
        frame = frame.astype(np.float32)
        
        # Scale to [0, 1]
        frame /= 255.0
        
        # Normalize using ImageNet stats
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        
        frame = (frame - mean) / std
        
        return frame
```

### 24.3 Testing Framework
```python
# Testing Framework Setup
import pytest
import asyncio
from typing import Generator
from unittest.mock import Mock

class TestBase:
    """Base class for SALAMA tests."""
    
    @pytest.fixture
    async def setup_test_env(self) -> Generator:
        """Setup test environment."""
        # Setup test database
        test_db = await setup_test_database()
        
        # Setup test cache
        test_cache = await setup_test_cache()
        
        # Setup test models
        test_models = await setup_test_models()
        
        yield {
            "db": test_db,
            "cache": test_cache,
            "models": test_models
        }
        
        # Cleanup
        await cleanup_test_env()
    
    @pytest.fixture
    def mock_camera(self) -> Mock:
        """Mock camera for testing."""
        camera = Mock()
        camera.get_frame.return_value = np.zeros((640, 480, 3))
        return camera
    
    @pytest.fixture
    def mock_model(self) -> Mock:
        """Mock AI model for testing."""
        model = Mock()
        model.detect.return_value = []
        return model

class TestAIPipeline:
    """Test AI pipeline components."""
    
    async def test_object_detection(
        self,
        setup_test_env,
        mock_camera
    ):
        """Test object detection pipeline."""
        # Arrange
        pipeline = AIPipeline(setup_test_env["models"])
        test_frame = await mock_camera.get_frame()
        
        # Act
        results = await pipeline.process_frame(test_frame)
        
        # Assert
        assert isinstance(results, dict)
        assert "detections" in results
        assert isinstance(results["detections"], list)
        
    async def test_context_analysis(
        self,
        setup_test_env,
        mock_model
    ):
        """Test context analysis."""
        # Arrange
        analyzer = ContextAnalyzer(setup_test_env["models"])
        test_context = {"test": "data"}
        
        # Act
        analysis = await analyzer.analyze_context(test_context)
        
        # Assert
        assert isinstance(analysis, dict)
        assert "risk_level" in analysis
```

### 24.4 Debugging Tools
```python
# Debugging Tools Implementation
class SALAMADebugger:
    """Debugging tools for SALAMA."""
    
    def __init__(self):
        self.log_manager = DebugLogManager()
        self.profiler = PerformanceProfiler()
        
    async def debug_pipeline(
        self,
        frame: np.ndarray,
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Debug AI pipeline processing."""
        debug_info = {
            "timestamp": datetime.now(),
            "frame_info": self._get_frame_info(frame),
            "stages": []
        }
        
        try:
            # Profile YOLOv5 detection
            with self.profiler.profile("yolo_detection"):
                detections = await self._debug_detection(frame)
            debug_info["stages"].append({
                "name": "detection",
                "results": detections,
                "profile": self.profiler.get_stats("yolo_detection")
            })
            
            # Profile LLaMA analysis
            with self.profiler.profile("llama_analysis"):
                analysis = await self._debug_analysis(detections)
            debug_info["stages"].append({
                "name": "analysis",
                "results": analysis,
                "profile": self.profiler.get_stats("llama_analysis")
            })
            
            return debug_info
            
        except Exception as e:
            debug_info["error"] = str(e)
            self.log_manager.log_error(e, debug_info)
            raise

class PerformanceProfiler:
    """Performance profiling tools."""
    
    def __init__(self):
        self.profiles = {}
        
    @contextmanager
    def profile(self, name: str):
        """Profile code block execution."""
        start_time = time.perf_counter()
        start_memory = self._get_memory_usage()
        
        try:
            yield
        finally:
            end_time = time.perf_counter()
            end_memory = self._get_memory_usage()
            
            self.profiles[name] = {
                "execution_time": end_time - start_time,
                "memory_delta": end_memory - start_memory,
                "timestamp": datetime.now()
            }
```

### 24.5 Development Workflows
```python
# Development Workflow Management
class WorkflowManager:
    """Manage development workflows."""
    
    def __init__(self):
        self.git_manager = GitManager()
        self.ci_manager = CIManager()
        self.deploy_manager = DeploymentManager()
        
    async def create_feature(
        self,
        feature_name: str,
        description: str
    ) -> str:
        """Create new feature branch and setup."""
        try:
            # Create branch
            branch_name = f"feature/{feature_name}"
            await self.git_manager.create_branch(branch_name)
            
            # Setup feature environment
            await self._setup_feature_env(feature_name)
            
            # Create feature documentation
            await self._create_feature_docs(
                feature_name,
                description
            )
            
            return branch_name
            
        except Exception as e:
            logger.error(f"Feature creation error: {e}")
            raise
            
    async def submit_feature(
        self,
        feature_name: str
    ) -> str:
        """Submit feature for review."""
        try:
            # Run tests
            await self._run_feature_tests(feature_name)
            
            # Create pull request
            pr_url = await self.git_manager.create_pull_request(
                feature_name
            )
            
            # Trigger CI pipeline
            await self.ci_manager.trigger_pipeline(feature_name)
            
            return pr_url
            
        except Exception as e:
            logger.error(f"Feature submission error: {e}")
            raise
```

[Continue to Part 14: System Documentation and API Reference...]