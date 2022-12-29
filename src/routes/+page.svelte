<script lang="ts">
	import { onMount } from 'svelte';
	import { syncLock } from '../svg/image';
	import './page.css';

	$: wordLength = 12;
	$: includesUpperCase = true;
	$: includesLowerCase = true;
	$: includesNumber = true;
	$: includesSpecial = true;

	$: firstDefault = true;
	$: firstUpper = false;
	$: firstLower = false;
	$: firstNumber = false;
	$: firstSpecial = false;

	$: result = '';

	$: disabled =
		!includesUpperCase && !includesLowerCase && !includesNumber && !includesSpecial;

	const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lower = 'abcdefghijklmnopqrstuvwxyz';
	const number = '1234567890';
	const special = `~!@#$%^&*()-=_+[]\{}|;':",./<>?`;

	function inputRangeChange(event: Event) {
		const input = event.target as HTMLInputElement;
		wordLength = Number(input.value);
		generateCalcArray();
	}

	function inputCheckChange(event: Event) {
		const input = event.target as HTMLInputElement;
		switch (input.id) {
			case 'includesUpperCase':
				includesUpperCase = input.checked;
				if (!input.checked && firstUpper) {
					firstDefault = true;
				}
				break;
			case 'includesLowerCase':
				includesLowerCase = input.checked;
				if (!input.checked && firstLower) {
					firstLower = false;
					firstDefault = true;
				}
				break;
			case 'includesNumber':
				includesNumber = input.checked;
				if (!input.checked && firstNumber) {
					firstNumber = false;
					firstDefault = true;
				}
				break;
			case 'includesSpecial':
				includesSpecial = input.checked;
				if (!input.checked && firstSpecial) {
					firstSpecial = false;
					firstDefault = true;
				}
				break;
		}
		disabled = !includesUpperCase && !includesLowerCase && !includesNumber && !includesSpecial;
		console.log(getArray());
	}

	function inputRadioChange(event: Event) {
		const input = event.target as HTMLInputElement;

		firstUpper = false;
		firstLower = false;
		firstNumber = false;
		firstSpecial = false;
		firstDefault = false;
		switch (input.id) {
			case 'firstDefault':
				firstDefault = input.checked;
				break;
			case 'firstUpper':
				firstUpper = input.checked;
				break;
			case 'firstLower':
				firstLower = input.checked;
				break;
			case 'firstNumber':
				firstNumber = input.checked;
				break;
			case 'firstSpecial':
				firstSpecial = input.checked;
				break;
		}
		console.log(firstDefault, firstUpper, firstLower, firstNumber, firstSpecial);
	}

	function generateUpperWord(len: Number): string {
		let str = '';
		for (let i = 0; i < len; i++) {
			let index = Math.floor(Math.random() * upper.length);
			str += upper[index];
		}
		return str;
	}

	function generateLowerWord(len: Number): string {
		let str = '';
		for (let i = 0; i < len; i++) {
			let index = Math.floor(Math.random() * lower.length);
			str += lower[index];
		}
		return str;
	}

	function generateNumber(len: Number): string {
		let str = '';
		for (let i = 0; i < len; i++) {
			let index = Math.floor(Math.random() * number.length);
			str += number[index];
		}
		return str;
	}

	function generateSpecial(len: Number): string {
		let str = '';
		for (let i = 0; i < len; i++) {
			let index = Math.floor(Math.random() * special.length);
			str += special[index];
		}
		return str;
	}

	function getArray() {
		return [includesLowerCase, includesNumber, includesSpecial, includesUpperCase].filter(
			(item) => item === true
		);
	}

	function generateCalcArray() {
		const base = Math.round(wordLength / 2);
		let arr = [
			Math.floor(Math.random() * base),
			Math.floor(Math.random() * base),
			Math.round((Math.random() + 1) * base)
		];
		while (arr.reduce((acc, cur) => acc + cur) !== wordLength) {
			arr = [
				Math.floor(Math.random() * base),
				Math.floor(Math.random() * base),
				Math.floor(Math.random() * base)
			];
		}
		console.log(arr);
		return arr;
	}

	function generateString() {
		const str =
			generateUpperWord(4) + generateLowerWord(4) + generateNumber(4) + generateSpecial(4);
		const arr = str.split('');
		result = arr.sort(() => Math.random() - Math.random()).join('');
	}

	onMount(() => {
		generateString();
	});
</script>

<div class="flex justify-center items-center p-6">
	<div class="pg-card">
		<div class="pg-card-field">
			<input class="outline-none" readonly bind:value={result} placeholder="Abcdef1234&^&" />
			<button {disabled} on:click={generateString}>
				{@html syncLock}
			</button>
		</div>

		<div class="flex items-center mt-8">
			<input
				{disabled}
				on:change={inputRangeChange}
				type="range"
				class="flex-1"
				max="24"
				min="6"
				bind:value={wordLength}
				step="1"
			/>
			<div class="text-gray-400 ml-2 text-sm">长度 {wordLength}</div>
		</div>

		<div class="p-4 mt-6">
			<hr class="my-4" />
			<div class="flex items-center mt-3">
				<input on:change={inputCheckChange} type="checkbox" id="includesUpperCase" checked /><label
					class="ml-2 text-gray-500 text-sm"
					for="includesUpperCase">包含大写字母(ABCDEF…)</label
				>
			</div>

			<div class="flex items-center mt-3">
				<input on:change={inputCheckChange} type="checkbox" id="includesLowerCase" checked /><label
					class="ml-2 text-gray-500 text-sm"
					for="includesLowerCase">包含小写字母(abcdef…)</label
				>
			</div>

			<div class="flex items-center mt-3">
				<input on:change={inputCheckChange} type="checkbox" id="includesNumber" checked /><label
					class="ml-2 text-gray-500 text-sm"
					for="includesNumber">包含数字(123456…)</label
				>
			</div>

			<div class="flex items-center mt-3">
				<input on:change={inputCheckChange} type="checkbox" id="includesSpecial" checked /><label
					class="ml-2 text-gray-500 text-sm"
					for="includesSpecial">包含特殊字符(!@#$%^…)</label
				>
			</div>
			<hr class="mt-4" />
		</div>

		<div class="p-4">
			<div class="flex flex-row max-sm:flex-col text-sm text-gray-500 space-x-4 max-sm:space-x-0">
				<div class="flex items-center">
					<input
						type="radio"
						name="first_letter"
						id="firstDefault"
						checked={firstDefault}
						on:change={inputRadioChange}
					/> <label for="firstDefault" class="ml-1">无</label>
				</div>
				<div class="flex items-center">
					<input
						type="radio"
						name="first_letter"
						id="firstUpper"
						disabled={!includesUpperCase}
						checked={firstUpper}
						on:change={inputRadioChange}
					/> <label for="firstUpper" class="ml-1">首字大写</label>
				</div>
				<div class="flex items-center">
					<input
						type="radio"
						name="first_letter"
						id="firstLower"
						checked={firstLower}
						disabled={!includesLowerCase}
						on:change={inputRadioChange}
					/>
					<label for="firstLower" class="ml-1">首字小写</label>
				</div>
				<div class="flex items-center">
					<input
						type="radio"
						name="first_letter"
						id="firstNumber"
						checked={firstNumber}
						disabled={!includesNumber}
						on:change={inputRadioChange}
					/> <label for="firstNumber" class="ml-1">首字数字</label>
				</div>
				<div class="flex items-center">
					<input
						type="radio"
						name="first_letter"
						id="firstSpecial"
						checked={firstSpecial}
						disabled={!includesSpecial}
						on:change={inputRadioChange}
					/> <label for="firstSpecial" class="ml-1">首字特殊字符</label>
				</div>
			</div>
		</div>
	</div>
</div>
