const familyMembers = [
    { name: "Marsha Thompson", role: "Mother", image: "images/mom.jpg", bio: "The heart of our family. Happy Mother's Day!" },
    { name: "Winston Edwards", role: "Father", image: "images/dad.jpg", bio: "The strongest man we know." },
    { name: "Jezoar Reece", role: "Eldest Brother", image: "images/jezour.jpg", bio: "Leading the way." },
    { name: "Zahyr Reece", role: "Second Oldest", image: "images/zahyr.jpg", bio: "Always there for us." },
    { name: "Theodore Edwards", role: "Third Oldest", image: "images/theo.jpg", bio: "The creative spirit." },
    { name: "Jamall Edwards", role: "Youngest Brother", image: "images/jamall.jpg", bio: "The one who keeps us laughing." },
    { name: "Miah Edwards", role: "Youngest Child", image: "images/miah.jpg", bio: "The light of the house." }
];

// 1. FLOATING HEARTS SYSTEM
function createHeart() {
    const heart = document.createElement("div");
    heart.className = "heart-particle";
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (Math.random() * 3 + 3) + "s";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
setInterval(createHeart, 800);

// 2. GARDEN LOGIC
let selectedEmoji = '🌸';
window.setFlower = (emoji) => {
    selectedEmoji = emoji;
    document.querySelectorAll('[id^="btn-"]').forEach(btn => btn.classList.remove('ring-4'));
    document.getElementById(`btn-${emoji}`).classList.add('ring-4');
};

const garden = document.getElementById('garden-plot');
if(garden) {
    garden.addEventListener('click', (e) => {
        const rect = garden.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const flower = document.createElement('div');
        flower.className = 'garden-flower text-5xl';
        flower.style.left = `${x}px`;
        flower.style.top = `${y}px`;
        flower.innerText = selectedEmoji;
        garden.appendChild(flower);
    });
}
window.clearGarden = () => { garden.innerHTML = ''; };

// 3. MEMBER CARDS (Restored Guest of Honor Badge)
function createMemberCard(member) {
    const isMom = member.role === "Mother";
    return `
        <div class="relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover-card border-2 ${isMom ? 'border-amber-400 scale-105' : 'border-transparent dark:border-slate-700'}">
            
            ${isMom ? `
                <span class="absolute -top-4 bg-amber-500 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg z-10 animate-bounce">
                    Guest of Honor
                </span>
            ` : ''}

            <img src="${member.image}" onerror="this.src='images/default.jpg'" class="w-40 h-40 rounded-full object-cover mb-4 border-4 border-slate-50 dark:border-slate-700 shadow-inner">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">${member.name}</h3>
            <p class="text-sm text-amber-500 font-bold uppercase mb-4 tracking-widest">${member.role}</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">${member.bio}</p>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    // THEME TOGGLE LOGIC
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.onclick = () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (window.lucide) lucide.createIcons();
        };
    }

    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    const membersContainer = document.getElementById('members-container');
    if(membersContainer) {
        membersContainer.innerHTML = familyMembers.map(m => createMemberCard(m)).join("");
    }

    if (window.lucide) lucide.createIcons();

    // STORY LOGIC
    const storyBox = document.getElementById("story-box");
    const saveBtn = document.getElementById("save-story");
    const clearBtn = document.getElementById("clear-story");

    if (storyBox) {
        const savedStory = localStorage.getItem("familyStory");
        if (savedStory) storyBox.innerText = savedStory;

        if (saveBtn) {
            saveBtn.onclick = () => {
                localStorage.setItem("familyStory", storyBox.innerText);
                saveBtn.innerText = "Saved! ✨";
                if (window.confetti) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                setTimeout(() => saveBtn.innerText = "Save Story", 1500);
            };
        }

        if (clearBtn) {
            clearBtn.onclick = () => {
                if(confirm("Clear the story?")) {
                    localStorage.removeItem("familyStory");
                    storyBox.innerText = "Click here to write something beautiful...";
                }
            };
        }
    }

    // MEMORY SYSTEM
    const memoriesContainer = document.getElementById('memories-container');
    if(memoriesContainer) {
        const uploadSection = document.createElement("div");
        uploadSection.className = "col-span-full mb-12 bg-slate-100 dark:bg-slate-800/50 p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center";
        
        let options = familyMembers.map(m => `<option value="${m.name}">${m.name}</option>`).join("");
        uploadSection.innerHTML = `
            <h3 class="font-bold mb-4 text-xl dark:text-white">Add a Family Memory</h3>
            <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                <select id="member-select" class="p-3 border rounded-xl bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white outline-none">
                    <option value="">Choose Family Member</option>
                    ${options}
                </select>
                <input type="file" id="media-upload" accept="image/*,video/*" multiple class="text-sm dark:text-slate-400">
                <button id="upload-btn" class="px-8 py-3 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 rounded-xl font-bold">Upload</button>
            </div>
        `;

        memoriesContainer.parentNode.insertBefore(uploadSection, memoriesContainer);

        let savedMedia = JSON.parse(localStorage.getItem("familyMedia")) || [];

        function renderMedia() {
            memoriesContainer.innerHTML = "";
            if (savedMedia.length === 0) {
                memoriesContainer.innerHTML = `<p class="col-span-full text-center text-slate-400 py-12">No memories uploaded yet.</p>`;
                return;
            }

            familyMembers.forEach(member => {
                const memberMedia = savedMedia.filter(m => m.owner === member.name);
                if (memberMedia.length > 0) {
                    let section = `<div class="col-span-full mt-8 first:mt-0"><h3 class="text-2xl font-bold mb-6 border-b dark:border-slate-700 pb-2 dark:text-white">${member.name}</h3><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">`;
                    memberMedia.forEach(item => {
                        const tag = item.type.startsWith("image") ? `<img src="${item.data}" class="w-full h-48 object-cover rounded-2xl">` : `<video controls class="w-full h-48 object-cover rounded-2xl"><source src="${item.data}"></video>`;
                        section += `<div class="relative group shadow-md hover:shadow-xl transition-shadow rounded-2xl overflow-hidden">${tag}<button data-id="${item.id}" class="delete-btn absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><i data-lucide="trash-2" class="w-4 h-4"></i></button></div>`;
                    });
                    section += `</div></div>`;
                    memoriesContainer.innerHTML += section;
                }
            });

            if (window.lucide) lucide.createIcons();
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.onclick = () => {
                    const id = Number(btn.getAttribute("data-id"));
                    savedMedia = savedMedia.filter(m => m.id !== id);
                    localStorage.setItem("familyMedia", JSON.stringify(savedMedia));
                    renderMedia();
                };
            });
        }

        renderMedia();

        const uploadBtn = document.getElementById("upload-btn");
        if(uploadBtn) {
            uploadBtn.onclick = () => {
                const files = document.getElementById("media-upload").files;
                const selected = document.getElementById("member-select").value;
                if (!selected || !files.length) return alert("Select member and files.");
                
                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        savedMedia.push({ id: Date.now() + Math.random(), owner: selected, data: e.target.result, type: file.type });
                        localStorage.setItem("familyMedia", JSON.stringify(savedMedia));
                        renderMedia();
                    };
                    reader.readAsDataURL(file);
                });
            };
        }
    }
});
