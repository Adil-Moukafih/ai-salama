# SALAMA Technical Documentation - Part 10

## 21. Security Implementation

### 21.1 Authentication System
```python
# Authentication Service Implementation
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from passlib.hash import bcrypt
from fastapi import HTTPException, Security
from fastapi.security import OAuth2PasswordBearer

class AuthenticationService:
    """Comprehensive authentication service."""
    
    def __init__(self):
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire = timedelta(minutes=30)
        self.refresh_token_expire = timedelta(days=7)
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
        self.user_service = UserService()
        self.audit_log = SecurityAuditLog()
        
    async def authenticate_user(
        self,
        username: str,
        password: str
    ) -> Dict[str, str]:
        """Authenticate user and return tokens."""
        try:
            # Get user from database
            user = await self.user_service.get_user_by_username(username)
            if not user:
                raise InvalidCredentials("User not found")
                
            # Verify password
            if not self.verify_password(password, user.hashed_password):
                raise InvalidCredentials("Invalid password")
                
            # Generate tokens
            access_token = await self.create_access_token(
                data={"sub": user.username}
            )
            refresh_token = await self.create_refresh_token(
                data={"sub": user.username}
            )
            
            # Log successful authentication
            await self.audit_log.log_authentication(
                user.id,
                "success",
                request_metadata
            )
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
            
        except Exception as e:
            # Log failed authentication attempt
            await self.audit_log.log_authentication(
                username,
                "failure",
                request_metadata,
                str(e)
            )
            raise
            
    async def create_access_token(
        self,
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token."""
        to_encode = data.copy()
        expire = datetime.utcnow() + (
            expires_delta or self.access_token_expire
        )
        to_encode.update({
            "exp": expire,
            "type": "access"
        })
        
        token = jwt.encode(
            to_encode,
            self.secret_key,
            algorithm=self.algorithm
        )
        
        # Store token in blacklist cache for potential revocation
        await self.store_token_metadata(token, expire)
        
        return token
        
    async def verify_token(
        self,
        token: str
    ) -> Dict[str, Any]:
        """Verify JWT token."""
        try:
            # Check if token is blacklisted
            if await self.is_token_blacklisted(token):
                raise InvalidToken("Token has been revoked")
                
            # Decode token
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise InvalidToken("Token has expired")
        except jwt.JWTError:
            raise InvalidToken("Invalid token")
```

### 21.2 Role-Based Access Control (RBAC)
```python
# RBAC Implementation
from enum import Enum
from typing import Set, List

class Permission(str, Enum):
    """System permissions."""
    
    # Camera permissions
    VIEW_CAMERAS = "cameras:view"
    MANAGE_CAMERAS = "cameras:manage"
    
    # Alert permissions
    VIEW_ALERTS = "alerts:view"
    MANAGE_ALERTS = "alerts:manage"
    
    # System permissions
    VIEW_ANALYTICS = "analytics:view"
    MANAGE_SYSTEM = "system:manage"
    MANAGE_USERS = "users:manage"

class Role(str, Enum):
    """System roles."""
    
    ADMIN = "admin"
    OPERATOR = "operator"
    ANALYST = "analyst"
    VIEWER = "viewer"

class RBACService:
    """Role-based access control service."""
    
    def __init__(self):
        self.role_permissions: Dict[Role, Set[Permission]] = {
            Role.ADMIN: {
                Permission.VIEW_CAMERAS,
                Permission.MANAGE_CAMERAS,
                Permission.VIEW_ALERTS,
                Permission.MANAGE_ALERTS,
                Permission.VIEW_ANALYTICS,
                Permission.MANAGE_SYSTEM,
                Permission.MANAGE_USERS
            },
            Role.OPERATOR: {
                Permission.VIEW_CAMERAS,
                Permission.VIEW_ALERTS,
                Permission.MANAGE_ALERTS,
                Permission.VIEW_ANALYTICS
            },
            Role.ANALYST: {
                Permission.VIEW_CAMERAS,
                Permission.VIEW_ALERTS,
                Permission.VIEW_ANALYTICS
            },
            Role.VIEWER: {
                Permission.VIEW_CAMERAS,
                Permission.VIEW_ALERTS
            }
        }
        
    async def check_permission(
        self,
        user: User,
        required_permission: Permission
    ) -> bool:
        """Check if user has required permission."""
        user_permissions = await self.get_user_permissions(user)
        return required_permission in user_permissions
        
    async def get_user_permissions(
        self,
        user: User
    ) -> Set[Permission]:
        """Get all permissions for user."""
        permissions = set()
        
        # Add role-based permissions
        for role in user.roles:
            role_perms = self.role_permissions.get(role, set())
            permissions.update(role_perms)
            
        # Add custom permissions
        custom_perms = await self.get_custom_permissions(user)
        permissions.update(custom_perms)
        
        return permissions
```

### 21.3 Encryption Service
```python
# Encryption Service Implementation
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

class EncryptionService:
    """Data encryption service."""
    
    def __init__(self):
        self.key = self._generate_key()
        self.fernet = Fernet(self.key)
        
    def _generate_key(self) -> bytes:
        """Generate encryption key."""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=settings.ENCRYPTION_SALT,
            iterations=100000
        )
        key = base64.urlsafe_b64encode(
            kdf.derive(settings.SECRET_KEY.encode())
        )
        return key
        
    async def encrypt_data(
        self,
        data: str
    ) -> str:
        """Encrypt sensitive data."""
        try:
            encrypted_data = self.fernet.encrypt(
                data.encode()
            )
            return base64.urlsafe_b64encode(
                encrypted_data
            ).decode()
            
        except Exception as e:
            logger.error(f"Encryption error: {e}")
            raise EncryptionError("Failed to encrypt data")
            
    async def decrypt_data(
        self,
        encrypted_data: str
    ) -> str:
        """Decrypt encrypted data."""
        try:
            decoded_data = base64.urlsafe_b64decode(
                encrypted_data.encode()
            )
            decrypted_data = self.fernet.decrypt(
                decoded_data
            )
            return decrypted_data.decode()
            
        except Exception as e:
            logger.error(f"Decryption error: {e}")
            raise DecryptionError("Failed to decrypt data")
```

### 21.4 Security Monitoring
```python
# Security Monitoring Service
class SecurityMonitor:
    """Security monitoring and alerting service."""
    
    def __init__(self):
        self.alert_service = AlertService()
        self.audit_log = SecurityAuditLog()
        self.threat_detector = ThreatDetector()
        
    async def monitor_security_events(self):
        """Monitor and analyze security events."""
        while True:
            try:
                # Get latest security events
                events = await self.audit_log.get_recent_events()
                
                # Analyze for threats
                threats = await self.threat_detector.analyze_events(
                    events
                )
                
                # Handle detected threats
                for threat in threats:
                    await self._handle_threat(threat)
                    
                await asyncio.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logger.error(f"Security monitoring error: {e}")
                
    async def _handle_threat(
        self,
        threat: SecurityThreat
    ):
        """Handle detected security threat."""
        try:
            # Log threat
            await self.audit_log.log_threat(threat)
            
            # Create security alert
            alert = SecurityAlert(
                type="security_threat",
                severity=threat.severity,
                description=threat.description,
                metadata=threat.metadata
            )
            await self.alert_service.create_alert(alert)
            
            # Take immediate action if needed
            if threat.severity == "critical":
                await self._handle_critical_threat(threat)
                
        except Exception as e:
            logger.error(f"Threat handling error: {e}")

class ThreatDetector:
    """Detect security threats from events."""
    
    async def analyze_events(
        self,
        events: List[SecurityEvent]
    ) -> List[SecurityThreat]:
        """Analyze security events for threats."""
        threats = []
        
        # Group events by type
        event_groups = self._group_events(events)
        
        # Analyze login attempts
        login_threats = await self._analyze_login_attempts(
            event_groups.get("login", [])
        )
        threats.extend(login_threats)
        
        # Analyze API access patterns
        api_threats = await self._analyze_api_access(
            event_groups.get("api_access", [])
        )
        threats.extend(api_threats)
        
        # Analyze system access patterns
        system_threats = await self._analyze_system_access(
            event_groups.get("system_access", [])
        )
        threats.extend(system_threats)
        
        return threats
```

[Continue to Part 11: AI Model Management and Optimization...]