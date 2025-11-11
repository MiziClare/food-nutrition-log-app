package com.example.foodlogapp.Controller;

import com.example.foodlogapp.entity.User;
import com.example.foodlogapp.service.UserService;
import com.example.foodlogapp.dto.AuthRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Integer id) {
        User user = userService.findById(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    // Get user by email or all users
    @GetMapping
    public ResponseEntity<?> get(@RequestParam(value = "email", required = false) String email) {
        if (email != null && !email.isBlank()) {
            User user = userService.findByEmail(email);
            if (user == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(user);
        }
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    // Create user
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        int rows = userService.create(user);
        if (rows <= 0 || user.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.created(URI.create("/users/" + user.getId())).body(user);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Integer id, @RequestBody User user) {
        User existing = userService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        user.setId(id);
        int rows = userService.update(user);
        if (rows <= 0) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(userService.findById(id));
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        User existing = userService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Register: simple registration using User payload (name/email/password)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isBlank() || user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("email and password are required");
        }
        User exists = userService.findByEmail(user.getEmail());
        if (exists != null) {
            return ResponseEntity.badRequest().body("email already exists");
        }
        int rows = userService.create(user);
        if (rows <= 0 || user.getId() == null) {
            return ResponseEntity.badRequest().body("failed to register");
        }
        return ResponseEntity.created(URI.create("/users/" + user.getId())).body(user);
    }

    // Login: verify email/password and return basic user info
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        if (req.getEmail() == null || req.getEmail().isBlank() || req.getPassword() == null) {
            return ResponseEntity.badRequest().body("email and password are required");
        }
        User user = userService.findByEmail(req.getEmail());
        if (user == null) {
            return ResponseEntity.status(404).body("user not found");
        }
        if (!req.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body("invalid credentials");
        }
        return ResponseEntity.ok(user);
    }
}
