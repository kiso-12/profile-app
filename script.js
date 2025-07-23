// DOM要素の取得 (変更あり: resetImageBtn を追加)
const imageUploadInput = document.getElementById('imageUpload');
const nameInput = document.getElementById('name');
const introductionInput = document.getElementById('introduction');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const resetImageBtn = document.getElementById('resetImageBtn'); // リセットボタンを追加

const profileImagePreview = document.getElementById('profileImagePreview');
const profileNamePreview = document.getElementById('profileNamePreview');
const profileIntroductionPreview = document.getElementById('profileIntroductionPreview');

// デフォルトのプレースホルダー画像URL
const DEFAULT_IMAGE_SRC = 'https://via.placeholder.com/180/E0E0E0/FFFFFF?text=No+Image';

// プロフィールを読み込み、表示する関数
function loadProfile() {
    const savedProfileJSON = localStorage.getItem('myProfile');

    if (savedProfileJSON) {
        const savedProfile = JSON.parse(savedProfileJSON);

        if (savedProfile.fileData) {
            profileImagePreview.src = savedProfile.fileData;
        } else {
            profileImagePreview.src = DEFAULT_IMAGE_SRC; // デフォルト画像を使用
        }

        nameInput.value = savedProfile.name || '';
        introductionInput.value = savedProfile.introduction || '';

        profileNamePreview.textContent = savedProfile.name || 'あなたの氏名';
        profileIntroductionPreview.textContent = savedProfile.introduction || 'ここに自己紹介文が表示されます。';
    } else {
        profileImagePreview.src = DEFAULT_IMAGE_SRC; // デフォルト画像を使用
        profileNamePreview.textContent = 'あなたの氏名';
        profileIntroductionPreview.textContent = 'ここに自己紹介文が表示されます。';
    }
}

// プロフィールを保存する関数
async function saveProfile() {
    const profile = {
        name: nameInput.value,
        introduction: introductionInput.value,
        fileData: profileImagePreview.src // 現在プレビューに表示されている画像データを保存
    };

    if (imageUploadInput.files && imageUploadInput.files[0]) {
        try {
            profile.fileData = await readFileAsBase64(imageUploadInput.files[0]);
        } catch (error) {
            console.error("画像の読み込みに失敗しました:", error);
            alert("画像のアップロードに失敗しました。");
            return;
        }
    } else if (profileImagePreview.src === DEFAULT_IMAGE_SRC) {
        // 画像がデフォルトに戻されている場合、fileDataをnullまたは空にする
        profile.fileData = null;
    }
    // その他の場合は、現在の profileImagePreview.src (Base64データまたは外部URL) をそのまま使用

    const profileJSON = JSON.stringify(profile);

    try {
        localStorage.setItem('myProfile', profileJSON);
        loadProfile();
        alert('プロフィールが保存されました！');
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert('保存できる容量を超えました。小さい画像を使用してください。');
        } else {
            alert('プロフィールの保存に失敗しました。');
        }
        console.error("保存エラー:", e);
    }
}

// ファイルをBase64形式で読み込む非同期関数 (変更なし)
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

// リアルタイムプレビューを更新する関数
function updatePreview() {
    if (imageUploadInput.files && imageUploadInput.files[0]) {
        const file = imageUploadInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            profileImagePreview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        profileImagePreview.src = DEFAULT_IMAGE_SRC; // デフォルト画像に戻す
    }

    profileNamePreview.textContent = nameInput.value || 'あなたの氏名';
    profileIntroductionPreview.textContent = introductionInput.value || 'ここに自己紹介文が表示されます。';
}

// 画像をリセットする関数 (新規追加)
function resetImage() {
    imageUploadInput.value = ''; // ファイル選択をクリア
    profileImagePreview.src = DEFAULT_IMAGE_SRC; // プレビュー画像をデフォルトに戻す
    // ※注意：この時点ではローカルストレージには保存されない。保存するにはsaveProfileBtnを押す必要がある。
}


// イベントリスナーの設定 (変更あり: resetImageBtn のイベントを追加)
window.addEventListener('load', loadProfile);
saveProfileBtn.addEventListener('click', saveProfile);
imageUploadInput.addEventListener('change', updatePreview);
nameInput.addEventListener('input', updatePreview);
introductionInput.addEventListener('input', updatePreview);
resetImageBtn.addEventListener('click', resetImage); // リセットボタンのクリックイベントを追加
