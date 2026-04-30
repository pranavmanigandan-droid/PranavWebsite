import random
import os
import sys

class MazeGame:
    def __init__(self):
        self.level = 1
        self.maze = []
        self.player_pos = [1, 1]
        self.exit_pos = None
        
    def generate_maze(self, width, height):
        """Generate a simple maze using depth-first search"""
        self.maze = [['#' for _ in range(width)] for _ in range(height)]
        visited = set()
        
        def carve_path(x, y):
            visited.add((x, y))
            self.maze[y][x] = ' '
            directions = [(0, -2), (2, 0), (0, 2), (-2, 0)]
            random.shuffle(directions)
            
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if 0 < nx < width - 1 and 0 < ny < height - 1 and (nx, ny) not in visited:
                    self.maze[y + dy // 2][x + dx // 2] = ' '
                    carve_path(nx, ny)
        
        carve_path(1, 1)
        self.player_pos = [1, 1]
        self.exit_pos = [width - 2, height - 2]
        self.maze[self.exit_pos[1]][self.exit_pos[0]] = 'E'
        
    def display_maze(self):
        """Display the maze with player"""
        display = [row[:] for row in self.maze]
        display[self.player_pos[1]][self.player_pos[0]] = 'P'
        os.system('clear' if os.name == 'posix' else 'cls')
        for row in display:
            print(''.join(row))
        print(f"\nLevel: {self.level}")
        
    def move_player(self, direction):
        """Move player in given direction"""
        x, y = self.player_pos
        moves = {'w': (0, -1), 's': (0, 1), 'a': (-1, 0), 'd': (1, 0)}
        
        if direction in moves:
            dx, dy = moves[direction]
            nx, ny = x + dx, y + dy
            
            if 0 <= nx < len(self.maze[0]) and 0 <= ny < len(self.maze):
                if self.maze[ny][nx] != '#':
                    self.player_pos = [nx, ny]
                    return True
        return False
    
    def check_win(self):
        """Check if player reached exit"""
        return self.player_pos == self.exit_pos
    
    def play(self):
        """Main game loop"""
        while True:
            width = 15 + (self.level * 2)
            height = 11 + (self.level * 2)
            self.generate_maze(width, height)
            
            while True:
                self.display_maze()
                move = input("Move (w/a/s/d) or 'q' to quit: ").lower()
                
                if move == 'q':
                    print("Thanks for playing!")
                    return
                
                self.move_player(move)
                
                if self.check_win():
                    print(f"Level {self.level} complete!")
                    self.level += 1
                    input("Press Enter to continue to the next level...")
                    break

if __name__ == "__main__":
    game = MazeGame()
    game.play()
