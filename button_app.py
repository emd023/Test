import tkinter as tk
from tkinter import messagebox

def show_message():
    messagebox.showinfo("Success", "Good job!")

# Create the main window
root = tk.Tk()
root.title("Simple Button App")
root.geometry("300x150")

# Create and configure the button
button = tk.Button(
    root, 
    text="Click Me!", 
    command=show_message,
    font=("Arial", 14),
    bg="#4CAF50",
    fg="white",
    padx=20,
    pady=10
)

# Center the button in the window
button.pack(expand=True)

# Start the GUI event loop
root.mainloop()