<script lang="ts">
  import { onMount } from 'svelte';
	import './page.css';

	export let wordLength = 12;
	export let includesUpperCase = true;
	export let includesLowerCase = true;
	export let includesNumber = true;
	export let includesSpecial = true;

	export let firstDefault = true;
	export let firstUpper = false;
	export let firstLower = false;
	export let firstNumber = false;
	export let firstSpecial = false;

	export let result = '';

	export let disabled =
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
		switch (input.id) {
			case 'firstDefault':
				firstUpper = false;
				firstLower = false;
				firstNumber = false;
				firstSpecial = false;
				firstDefault = input.checked;
				break;
			case 'firstUpper':
				firstDefault = false;
				firstLower = false;
				firstNumber = false;
				firstSpecial = false;
				firstUpper = input.checked;
				break;
			case 'firstLower':
				firstDefault = false;
				firstUpper = false;
				firstNumber = false;
				firstSpecial = false;
				firstLower = input.checked;
				break;
			case 'firstNumber':
				firstUpper = false;
				firstLower = false;
				firstSpecial = false;
				firstDefault = false;
				firstNumber = input.checked;
				break;
			case 'firstSpecial':
				firstUpper = false;
				firstLower = false;
				firstDefault = false;
				firstNumber = false;
				firstSpecial = input.checked;
				break;
		}
    console.log(firstDefault, firstUpper, firstLower, firstNumber, firstSpecial)
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

	generateString();
	console.log(getArray());
</script>

<div class="flex justify-center items-center p-6">
	<div class="pg-card">
		<div class="pg-card-field">
			<input class="outline-none" readonly value={result} />
			<button {disabled} on:click={generateString}>
				<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"
					><path
						d="M16 22q-.425 0-.712-.288Q15 21.425 15 21v-3q0-.425.288-.712Q15.575 17 16 17v-1q0-.825.587-1.413Q17.175 14 18 14q.825 0 1.413.587Q20 15.175 20 16v1q.425 0 .712.288.288.287.288.712v3q0 .425-.288.712Q20.425 22 20 22Zm1-5h2v-1q0-.425-.288-.713Q18.425 15 18 15t-.712.287Q17 15.575 17 16Zm1-5q0-1.275-.512-2.387Q16.975 8.5 16 7.55V9q0 .425-.287.712Q15.425 10 15 10t-.712-.288Q14 9.425 14 9V5q0-.425.288-.713Q14.575 4 15 4h4q.425 0 .712.287Q20 4.575 20 5t-.288.713Q19.425 6 19 6h-1.725q1.475 1.325 2.088 2.837Q19.975 10.35 20 12ZM5 20q-.425 0-.713-.288Q4 19.425 4 19t.287-.712Q4.575 18 5 18h1.725q-1.275-1.1-2-2.65Q4 13.8 4 12q0-2.375 1.238-4.287Q6.475 5.8 8.475 4.825q.575-.275 1.05 0Q10 5.1 10 5.75q0 .3-.175.512-.175.213-.425.338-1.5.725-2.45 2.162Q6 10.2 6 12q0 1.35.537 2.488Q7.075 15.625 8 16.45V15q0-.425.288-.713Q8.575 14 9 14t.713.287Q10 14.575 10 15v4q0 .425-.287.712Q9.425 20 9 20Z"
					/></svg
				>
			</button>
		</div>

		<div class="flex items-center mt-8">
			<input
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
